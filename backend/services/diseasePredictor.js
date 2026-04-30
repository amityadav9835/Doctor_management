const redFlagPatterns = [
  {
    pattern: /\b(chest pain|chest tightness|shortness of breath|breathing problem|can't breathe|cannot breathe)\b/i,
    message:
      "Chest pain or breathing difficulty can be urgent. Seek emergency medical care immediately.",
  },
  {
    pattern: /\b(fainting|unconscious|seizure|stroke|one side weakness|face droop|slurred speech)\b/i,
    message: "Neurological emergency signs need immediate medical attention.",
  },
  {
    pattern: /\b(severe bleeding|blood in vomit|black stool|blood in stool|coughing blood)\b/i,
    message: "Bleeding symptoms should be evaluated urgently by a clinician.",
  },
  {
    pattern: /\b(severe headache|worst headache|vision loss|stiff neck)\b/i,
    message:
      "Severe headache with neurological or neck symptoms can be serious. Please seek urgent care.",
  },
  {
    pattern: /\b(high fever|fever.*103|fever.*104|infant fever|very high fever)\b/i,
    message: "Very high fever or fever in an infant should be assessed urgently.",
  },
  {
    pattern: /\b(lump|unexplained weight loss|night sweats|unusual bleeding)\b/i,
    message: "These warning signs need an in-person medical evaluation and tests.",
  },
];

const ruleConditions = [
  {
    disease: "Possible Cancer Warning Signs",
    speciality: "General physician",
    severity: "High",
    keywords: ["lump", "unexplained weight loss", "night sweats", "unusual bleeding", "weight loss"],
    medicines: ["No self-medication advised"],
    advice:
      "These symptoms need a proper in-person evaluation and diagnostic tests. Please book a doctor promptly.",
  },
  {
    disease: "Migraine or Severe Headache",
    speciality: "Neurologist",
    severity: "Medium",
    keywords: ["headache", "migraine", "light sensitivity", "nausea", "vomiting", "vision", "dizziness"],
    medicines: ["Paracetamol 500 mg", "Rest in a dark room", "Hydration"],
    advice:
      "Rest, drink fluids, and avoid bright light. Seek urgent care for worst-ever headache, weakness, confusion, or vision loss.",
  },
  {
    disease: "Gastritis or Food Poisoning",
    speciality: "Gastroenterologist",
    severity: "Medium",
    keywords: ["vomiting", "nausea", "stomach", "diarrhea", "loose motion", "abdominal", "acidity", "food"],
    medicines: ["ORS solution", "Light diet", "Antacid if advised"],
    advice:
      "Take small sips of ORS, eat light food, and avoid spicy meals. Consult a doctor if vomiting persists or dehydration appears.",
  },
  {
    disease: "Allergic Reaction",
    speciality: "Dermatologist",
    severity: "Medium",
    keywords: ["rash", "skin", "itching", "hives", "swelling", "allergy", "red spots"],
    medicines: ["Cetirizine 10 mg if suitable", "Cold compress", "Avoid suspected trigger"],
    advice:
      "Avoid the suspected trigger and monitor symptoms. Seek urgent care if there is facial swelling or breathing difficulty.",
  },
  {
    disease: "Respiratory Infection",
    speciality: "General physician",
    severity: "Medium",
    keywords: ["cough", "breathing", "shortness", "chest", "sore throat", "phlegm", "wheezing"],
    medicines: ["Steam inhalation", "Warm fluids", "Cough syrup if advised"],
    advice:
      "Rest and drink warm fluids. Breathing difficulty, chest pain, or oxygen issues need urgent medical attention.",
  },
  {
    disease: "Viral Fever",
    speciality: "General physician",
    severity: "Medium",
    keywords: ["fever", "temperature", "chills", "body pain", "weakness", "fatigue", "tired"],
    medicines: ["Paracetamol 500 mg", "ORS solution", "Vitamin C"],
    advice:
      "Rest, drink fluids, and monitor temperature. See a doctor if fever lasts more than 3 days or crosses 103 F.",
  },
  {
    disease: "Common Cold",
    speciality: "General physician",
    severity: "Low",
    keywords: ["cold", "runny nose", "sneezing", "blocked nose", "throat", "mild fever"],
    medicines: ["Saline nasal spray", "Steam inhalation", "Warm fluids"],
    advice:
      "Use steam inhalation, warm fluids, and rest. Consult a doctor if breathing becomes difficult or symptoms worsen.",
  },
  {
    disease: "Body Pain or Muscle Strain",
    speciality: "General physician",
    severity: "Low",
    keywords: ["body pain", "muscle", "strain", "back pain", "joint pain", "ache", "sprain"],
    medicines: ["Rest", "Warm compress", "Paracetamol 500 mg if suitable"],
    advice:
      "Rest the painful area and use warm compresses. See a doctor if pain follows injury, swelling, or weakness.",
  },
];

const detectRedFlags = (symptoms) =>
  redFlagPatterns
    .filter((item) => item.pattern.test(symptoms))
    .map((item) => item.message);

const scoreCondition = (symptoms, condition) =>
  condition.keywords.reduce((score, keyword) => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escapedKeyword}\\b`, "i");
    return pattern.test(symptoms) ? score + 1 : score;
  }, 0);

export const predictDisease = (symptoms = "") => {
  const normalizedSymptoms = symptoms.toLowerCase().trim();

  if (!normalizedSymptoms) return null;

  const redFlags = detectRedFlags(symptoms);
  const ranked = ruleConditions
    .map((condition) => ({
      ...condition,
      score: scoreCondition(normalizedSymptoms, condition),
    }))
    .filter((condition) => condition.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return {
      disease: "Insufficient symptom information",
      confidence: 0,
      lowConfidence: true,
      needsUrgentCare: redFlags.length > 0,
      redFlags,
      severity: redFlags.length > 0 ? "High" : "Unknown",
      speciality: "General physician",
      medicines: ["No self-medication advised"],
      supportiveCare: [],
      advice:
        "Please describe specific symptoms such as fever, cough, headache, pain location, duration, vomiting, rash, breathing difficulty, or other changes.",
      nextStep:
        "Add more symptom details or book a general physician for an in-person assessment.",
      alternatives: [],
    };
  }

  const best = ranked[0];
  const confidence = Math.min(95, Math.max(35, 35 + best.score * 15));
  const needsUrgentCare = redFlags.length > 0 || best.severity === "High";
  const lowConfidence = confidence < 45;

  return {
    disease: best.disease,
    confidence,
    lowConfidence,
    needsUrgentCare,
    redFlags,
    severity: needsUrgentCare ? "High" : best.severity,
    speciality: best.speciality,
    medicines: best.medicines,
    supportiveCare:
      best.medicines?.filter(
        (item) => !/ibuprofen|cetirizine|paracetamol|antacid|cough syrup/i.test(item)
      ) || [],
    advice: best.advice,
    nextStep: needsUrgentCare
      ? "Please seek urgent medical care or book the earliest available doctor. Do not rely on this tool for emergencies."
      : lowConfidence
      ? "The rule-based check has limited matching details. Please describe more symptoms or consult a general physician."
      : "Use this as a preliminary guide and confirm with a qualified doctor.",
    alternatives: ranked.slice(1, 4).map((item) => ({
      disease: item.disease,
      confidence: Math.min(90, Math.max(20, 35 + item.score * 15)),
    })),
  };
};

export const getSpecialityForDisease = (disease) => {
  const condition = ruleConditions.find((item) => item.disease === disease);
  return condition?.speciality || "General physician";
};
