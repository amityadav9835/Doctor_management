import doctorModel from "../models/doctor.js";
import { getSpecialityForDisease, predictDisease } from "../services/diseasePredictor.js";

const specialityPriority = {
  "Possible Cancer Warning Signs": ["General physician"],
  "Migraine or Severe Headache": ["Neurologist", "General physician"],
  "Gastritis or Food Poisoning": ["Gastroenterologist", "General physician"],
  "Allergic Reaction": ["Dermatologist", "General physician"],
  "Respiratory Infection": ["General physician"],
  "Viral Fever": ["General physician"],
  "Common Cold": ["General physician"],
  "Body Pain or Muscle Strain": ["General physician"],
};

const getDoctorRecommendations = async (disease) => {
  const targetSpecialities = specialityPriority[disease] || [
    getSpecialityForDisease(disease),
    "General physician",
  ];

  const specialityRegex = targetSpecialities.map(
    (speciality) => new RegExp(`^${speciality.trim()}$`, "i")
  );

  let doctors = await doctorModel
    .find({
      speciality: { $in: specialityRegex },
      available: true,
    })
    .select("-password -email")
    .sort({ available: -1, speciality: 1, experience: -1 })
    .limit(6);

  if (doctors.length === 0 && !targetSpecialities.includes("General physician")) {
    doctors = await doctorModel
      .find({
        speciality: /^General physician$/i,
        available: true,
      })
      .select("-password -email")
      .sort({ available: -1, experience: -1 })
      .limit(6);
  }

  if (doctors.length === 0) {
    doctors = await doctorModel
      .find({
        speciality: { $in: specialityRegex },
      })
      .select("-password -email")
      .sort({ available: -1, speciality: 1, experience: -1 })
      .limit(6);
  }

  return {
    targetSpecialities,
    doctors,
  };
};

export const predictDiseaseController = (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter symptoms for prediction.",
      });
    }

    const prediction = predictDisease(symptoms);

    if (!prediction) {
      return res.status(400).json({
        success: false,
        message: "Please provide more symptom details.",
      });
    }

    return res.json({
      success: true,
      ...prediction,
      disclaimer:
        "This rule-based result is for information only. It is not a diagnosis, prescription, or emergency service.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const recommendDoctorsController = async (req, res) => {
  try {
    const { disease } = req.body;

    if (!disease) {
      return res.status(400).json({
        success: false,
        message: "Disease is required for doctor recommendation.",
      });
    }

    const { targetSpecialities, doctors } = await getDoctorRecommendations(disease);

    return res.json({
      success: true,
      speciality: targetSpecialities[0],
      targetSpecialities,
      doctors,
      message:
        doctors.length > 0
          ? "Doctors matched by predicted condition and speciality."
          : "No available matching doctors found. Please contact the clinic directly or try another speciality.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
