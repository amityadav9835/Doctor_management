import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarClock,
  ClipboardList,
  Download,
  FileText,
  HeartPulse,
  Loader2,
  Pill,
  Send,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Thermometer,
  Trash2,
  User,
} from "lucide-react";

const symptomOptions = [
  "Fever",
  "Cough",
  "Headache",
  "Body Pain",
  "Fatigue",
  "Cold",
  "Sore Throat",
  "Vomiting",
  "Nausea",
  "Chest Pain",
  "Shortness of Breath",
  "Dizziness",
  "Weight Loss",
  "Skin Rash",
];

const defaultPatientInfo = {
  age: "",
  gender: "",
  duration: "",
  severityScore: "5",
  temperature: "",
  existingConditions: "",
};

const dangerSigns = [
  "Severe chest pain",
  "Severe breathing difficulty",
  "Fainting or confusion",
  "Blue lips or face",
  "Uncontrolled bleeding",
  "Very high fever",
];

const getCareLevel = (prediction, patientInfo) => {
  if (prediction?.needsUrgentCare) {
    return {
      label: "Urgent",
      color: "red",
      text: "Seek urgent care now or book the earliest available doctor.",
    };
  }

  if (Number(patientInfo.severityScore) >= 8) {
    return {
      label: "High priority",
      color: "amber",
      text: "Symptoms are severe. Book a doctor soon and monitor warning signs.",
    };
  }

  if (prediction?.lowConfidence) {
    return {
      label: "Needs review",
      color: "amber",
      text: "The rule-based match is limited. Add more details or confirm with a doctor.",
    };
  }

  return {
    label: "Routine",
    color: "emerald",
    text: "Suitable for routine consultation if symptoms stay stable.",
  };
};

const careLevelClasses = {
  red: "border-red-200 bg-red-50 text-red-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function PredictDisease() {
  const [input, setInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello, I am your AI health assistant. Describe symptoms or select quick options below.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [doctorRecommendationInfo, setDoctorRecommendationInfo] = useState(null);
  const [patientInfo, setPatientInfo] = useState(defaultPatientInfo);
  const [selectedDangerSigns, setSelectedDangerSigns] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("diseaseAssessments") || "[]");
    } catch {
      return [];
    }
  });
  const chatEndRef = useRef(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const symptomText = useMemo(
    () => selectedSymptoms.join(", "),
    [selectedSymptoms]
  );

  const structuredDetails = useMemo(() => {
    const details = [];

    if (patientInfo.age) details.push(`Age: ${patientInfo.age}`);
    if (patientInfo.gender) details.push(`Gender: ${patientInfo.gender}`);
    if (patientInfo.duration) details.push(`Duration: ${patientInfo.duration}`);
    if (patientInfo.severityScore) {
      details.push(`Symptom severity: ${patientInfo.severityScore}/10`);
    }
    if (patientInfo.temperature) {
      details.push(`Temperature: ${patientInfo.temperature}`);
    }
    if (patientInfo.existingConditions) {
      details.push(`Existing conditions or medicines: ${patientInfo.existingConditions}`);
    }
    if (selectedDangerSigns.length > 0) {
      details.push(`Warning signs: ${selectedDangerSigns.join(", ")}`);
    }

    return details.join(". ");
  }, [patientInfo, selectedDangerSigns]);

  const careLevel = useMemo(
    () => getCareLevel(prediction, patientInfo),
    [prediction, patientInfo]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    localStorage.setItem(
      "diseaseAssessments",
      JSON.stringify(assessmentHistory.slice(0, 5))
    );
  }, [assessmentHistory]);

  const toggleSymptom = (symptom) => {
    setPrediction(null);
    setRecommendedDoctors([]);
    setDoctorRecommendationInfo(null);
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const updatePatientInfo = (field, value) => {
    setPrediction(null);
    setRecommendedDoctors([]);
    setDoctorRecommendationInfo(null);
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDangerSign = (sign) => {
    setPrediction(null);
    setRecommendedDoctors([]);
    setDoctorRecommendationInfo(null);
    setSelectedDangerSigns((prev) =>
      prev.includes(sign)
        ? prev.filter((item) => item !== sign)
        : [...prev, sign]
    );
  };

  const buildClinicalSummary = () => {
    if (!prediction) return "";

    const doctors =
      recommendedDoctors.length > 0
        ? recommendedDoctors
            .map((doctor) => `${doctor.name} (${doctor.speciality})`)
            .join(", ")
        : "No matching doctor currently shown";

    return [
      "AI Disease Prediction Report",
      `Created: ${new Date().toLocaleString()}`,
      "",
      "Patient intake",
      `Age: ${patientInfo.age || "Not provided"}`,
      `Gender: ${patientInfo.gender || "Not provided"}`,
      `Duration: ${patientInfo.duration || "Not provided"}`,
      `Severity: ${patientInfo.severityScore || "Not provided"}/10`,
      `Temperature: ${patientInfo.temperature || "Not provided"}`,
      `Existing conditions or medicines: ${
        patientInfo.existingConditions || "Not provided"
      }`,
      `Warning signs: ${
        selectedDangerSigns.length > 0
          ? selectedDangerSigns.join(", ")
          : "None selected"
      }`,
      "",
      "Prediction",
      `Disease: ${prediction.disease}`,
      `Speciality: ${prediction.speciality}`,
      `Confidence: ${prediction.confidence}%`,
      `Severity: ${prediction.severity}`,
      `Care level: ${careLevel.label}`,
      `Next step: ${prediction.nextStep || careLevel.text}`,
      "",
      "Supportive care",
      `Medicines/support: ${
        prediction.medicines.length > 0
          ? prediction.medicines.join(", ")
          : "Not available"
      }`,
      `Advice: ${prediction.advice || "Not available"}`,
      "",
      "Recommended doctors",
      doctors,
      "",
      prediction.disclaimer ||
        "This result is for information only and is not a diagnosis.",
    ].join("\n");
  };

  const downloadReport = () => {
    const report = buildClinicalSummary();
    if (!report) return;

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `disease-assessment-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sendMessage = async () => {
    const finalInput = [input.trim() || symptomText.trim(), structuredDetails]
      .filter(Boolean)
      .join(". ");

    if (!finalInput) return;

    setMessages((prev) => [...prev, { role: "user", text: finalInput }]);
    setInput("");
    setLoading(true);
    setPrediction(null);
    setRecommendedDoctors([]);
    setDoctorRecommendationInfo(null);

    try {
      const { data } = await axios.post(`${backendUrl}/api/ai/predict-disease`, {
        symptoms: finalInput,
      });

      if (!data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.message || "Sorry, I could not predict the disease.",
          },
        ]);
        return;
      }

      const result = {
        disease: data.disease,
        confidence: data.confidence,
        lowConfidence: data.lowConfidence,
        needsUrgentCare: data.needsUrgentCare,
        redFlags: data.redFlags || [],
        severity: data.severity,
        speciality: data.speciality,
        medicines: data.medicines || [],
        supportiveCare: data.supportiveCare || [],
        advice: data.advice,
        nextStep: data.nextStep,
        alternatives: data.alternatives || [],
        disclaimer: data.disclaimer,
      };

      setPrediction(result);
      setAssessmentHistory((prev) => [
        {
          id: Date.now(),
          disease: result.disease,
          confidence: result.confidence,
          speciality: result.speciality,
          careLevel: getCareLevel(result, patientInfo).label,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 5));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.needsUrgentCare
            ? `I found possible warning signs. The rule-based result is "${data.disease}", but you should seek urgent medical care or book the earliest doctor.`
            : `The closest rule-based match is "${data.disease}". Please treat this as triage guidance and confirm with a qualified doctor.`,
        },
      ]);

      const doctorRes = await axios.post(
        `${backendUrl}/api/ai/recommend-doctors`,
        { disease: data.disease }
      );

      if (doctorRes.data.success) {
        setRecommendedDoctors(doctorRes.data.doctors || []);
        setDoctorRecommendationInfo({
          message: doctorRes.data.message,
          speciality: doctorRes.data.speciality,
          targetSpecialities: doctorRes.data.targetSpecialities || [],
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error?.response?.data?.message ||
            "Something went wrong while analyzing your symptoms.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearAll = () => {
    setInput("");
    setSelectedSymptoms([]);
    setPatientInfo(defaultPatientInfo);
    setSelectedDangerSigns([]);
    setPrediction(null);
    setRecommendedDoctors([]);
    setDoctorRecommendationInfo(null);
    setMessages([
      {
        role: "assistant",
        text: "Chat cleared. Please enter your symptoms again.",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                Rule-based symptom checker
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                AI Doctor Disease Prediction
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Enter symptoms like fever, headache, body pain, stomach issues,
                breathing trouble, skin rash, or warning signs. The backend
                uses clear symptom rules to return a triage-level prediction,
                safety warnings, and matched doctors.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg">
                <HeartPulse className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-2 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                    AI Health Assistant
                  </h2>
                  <p className="text-sm text-slate-500">
                    Chat-style symptom analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
              <p className="mb-3 text-sm font-medium text-slate-700">
                Quick symptoms
              </p>

              <div className="flex flex-wrap gap-2">
                {symptomOptions.map((symptom) => {
                  const active = selectedSymptoms.includes(symptom);

                  return (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Selected:
                  </span>{" "}
                  {selectedSymptoms.join(", ")}
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-slate-800">
                  <ClipboardList className="h-4 w-4" />
                  <p className="text-sm font-semibold">Patient intake</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    value={patientInfo.age}
                    onChange={(e) => updatePatientInfo("age", e.target.value)}
                    placeholder="Age"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  <select
                    value={patientInfo.gender}
                    onChange={(e) => updatePatientInfo("gender", e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>

                  <input
                    value={patientInfo.duration}
                    onChange={(e) =>
                      updatePatientInfo("duration", e.target.value)
                    }
                    placeholder="Duration, e.g. 2 days"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  <input
                    value={patientInfo.temperature}
                    onChange={(e) =>
                      updatePatientInfo("temperature", e.target.value)
                    }
                    placeholder="Temperature, e.g. 101 F"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Symptom severity</span>
                    <span>{patientInfo.severityScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={patientInfo.severityScore}
                    onChange={(e) =>
                      updatePatientInfo("severityScore", e.target.value)
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>

                <textarea
                  rows={2}
                  value={patientInfo.existingConditions}
                  onChange={(e) =>
                    updatePatientInfo("existingConditions", e.target.value)
                  }
                  placeholder="Existing conditions, allergies, pregnancy, or current medicines"
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold text-slate-600">
                    Warning signs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dangerSigns.map((sign) => {
                      const active = selectedDangerSigns.includes(sign);

                      return (
                        <button
                          key={sign}
                          onClick={() => toggleDangerSign(sign)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            active
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50"
                          }`}
                        >
                          {sign}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[420px] overflow-y-auto px-4 py-4 sm:px-6">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[90%] items-start gap-3 sm:max-w-[75%] ${
                        msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )}
                      </div>

                      <div
                        className={`rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          msg.role === "user"
                            ? "rounded-tr-md bg-indigo-600 text-white"
                            : "rounded-tl-md border border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[90%] items-start gap-3 sm:max-w-[75%]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="rounded-3xl rounded-tl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing symptoms...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="border-t border-slate-200 px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  rows={3}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Example: I have fever, headache, body pain, and weakness since yesterday..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <div className="flex gap-2 sm:flex-col">
                  <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>

                  <button
                    onClick={clearAll}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                This tool is for informational purposes only and does not
                replace professional medical diagnosis.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Prediction Result
                  </h3>
                  <p className="text-sm text-slate-500">
                    Rule-based health insight
                  </p>
                </div>
              </div>

              {prediction ? (
                <div className="space-y-4">
                  <div
                    className={`rounded-2xl border p-4 ${
                      careLevelClasses[careLevel.color]
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          <p className="text-sm font-semibold">
                            Care Level: {careLevel.label}
                          </p>
                        </div>
                        <p className="text-sm leading-6 text-slate-700">
                          {careLevel.text}
                        </p>
                      </div>

                      <button
                        onClick={downloadReport}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4" />
                        Report
                      </button>
                    </div>
                  </div>

                  {prediction.needsUrgentCare && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-red-700">
                        <ShieldAlert className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          Urgent Care Warning
                        </span>
                      </div>
                      <div className="space-y-2 text-sm leading-6 text-slate-700">
                        {prediction.redFlags.length > 0 ? (
                          prediction.redFlags.map((flag) => (
                            <p key={flag}>{flag}</p>
                          ))
                        ) : (
                          <p>
                            This result includes high-risk warning signs. Please
                            seek medical care promptly.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Closest Rule Match</p>
                    <h4 className="mt-1 text-2xl font-bold text-slate-900">
                      {prediction.disease}
                    </h4>
                    <p className="mt-1 text-sm text-indigo-600">
                      Specialist: {prediction.speciality}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-500">Confidence</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {prediction.confidence}%
                      </p>
                      {prediction.lowConfidence && (
                        <p className="mt-1 text-xs font-medium text-amber-600">
                          Low confidence. Add more details or consult a doctor.
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-500">Severity</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {prediction.severity}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-indigo-700">
                      <Pill className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        Supportive Care, Not Prescription
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {prediction.medicines.map((medicine) => (
                        <span
                          key={medicine}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm"
                        >
                          {medicine}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      {prediction.advice}
                    </p>
                    {prediction.nextStep && (
                      <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold leading-6 text-slate-800">
                        Next step: {prediction.nextStep}
                      </p>
                    )}
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Do not start, stop, or change medicine based only on this
                      tool. Confirm dose and suitability with a doctor,
                      especially for children, pregnancy, allergies, kidney or
                      liver disease, or existing medicines.
                    </p>
                  </div>

                  {prediction.alternatives.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="mb-2 text-sm font-semibold text-slate-800">
                        Other possible matches
                      </p>
                      <div className="space-y-2">
                        {prediction.alternatives.map((item) => (
                          <div
                            key={item.disease}
                            className="flex items-center justify-between gap-3 text-sm text-slate-600"
                          >
                            <span>{item.disease}</span>
                            <span className="font-semibold text-slate-900">
                              {item.confidence}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-amber-700">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-sm font-semibold">Important</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      {prediction.disclaimer ||
                        "If symptoms are severe or worsening, consult a qualified doctor immediately."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <Stethoscope className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    No prediction yet. Enter symptoms and click send to analyze.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-600">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recommended Doctors
                  </h3>
                  <p className="text-sm text-slate-500">
                    {doctorRecommendationInfo?.speciality
                      ? `Recommended speciality: ${doctorRecommendationInfo.speciality}`
                      : "Matched by predicted condition and speciality"}
                  </p>
                </div>
              </div>

              {recommendedDoctors.length > 0 ? (
                <div className="space-y-4">
                  {recommendedDoctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="rounded-2xl border border-slate-200 p-4 transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-base font-semibold text-slate-900">
                            {doctor.name}
                          </h4>
                          <p className="text-sm text-indigo-600">
                            {doctor.speciality}
                          </p>
                          {!doctor.available && (
                            <p className="mt-1 text-xs font-semibold text-amber-600">
                              Currently marked unavailable
                            </p>
                          )}
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>Experience: {doctor.experience}</span>
                            <span>Fees: Rs. {doctor.fees}</span>
                          </div>
                        </div>

                        <button
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                          onClick={() =>
                            (window.location.href = `/appointment/${doctor._id}`)
                          }
                        >
                          Book Now
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-600">
                    {prediction
                      ? doctorRecommendationInfo?.message ||
                        "No matching doctor found for this condition. Please contact the clinic directly or try the relevant speciality from All Doctors."
                      : "Doctor recommendations will appear here after prediction."}
                  </p>
                  {doctorRecommendationInfo?.targetSpecialities?.length > 0 && (
                    <p className="mt-2 text-xs font-semibold text-indigo-600">
                      Tried: {doctorRecommendationInfo.targetSpecialities.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Recent Assessments
                    </h3>
                    <p className="text-sm text-slate-500">
                      Stored on this device for quick follow-up
                    </p>
                  </div>
                </div>

                {assessmentHistory.length > 0 && (
                  <button
                    onClick={() => setAssessmentHistory([])}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                    title="Clear assessment history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {assessmentHistory.length > 0 ? (
                <div className="space-y-3">
                  {assessmentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-slate-900">
                              {item.disease}
                            </h4>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                              {item.careLevel}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-indigo-600">
                            {item.speciality}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>Confidence: {item.confidence}%</span>
                            <span>
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-600">
                    Completed predictions will be saved here for comparison and
                    follow-up.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
