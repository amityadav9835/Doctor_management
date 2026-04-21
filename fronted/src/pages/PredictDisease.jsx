import React, { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  Stethoscope,
  Sparkles,
  Send,
  Bot,
  User,
  Activity,
  ShieldAlert,
  BadgeCheck,
  Loader2,
  HeartPulse,
  Pill,
  ArrowRight,
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
];

export default function PredictDisease() {
  const [input, setInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello 👋 I’m your AI health assistant. Please describe your symptoms, or select from the quick options below.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const chatEndRef = useRef(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const symptomText = useMemo(() => {
    return selectedSymptoms.join(", ");
  }, [selectedSymptoms]);

  const toggleSymptom = (symptom) => {
    setPrediction(null);
    setRecommendedDoctors([]);

    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  const sendMessage = async () => {
    const finalInput = input.trim() || symptomText.trim();

    if (!finalInput) return;

    const userMessage = {
      role: "user",
      text: finalInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setPrediction(null);
    setRecommendedDoctors([]);

    try {
      // 1) prediction API
      // Expected response example:
      // {
      //   success: true,
      //   disease: "Viral Fever",
      //   confidence: 87,
      //   severity: "Medium",
      //   advice: "Take rest, stay hydrated, and consult a doctor if fever persists."
      // }

      const { data } = await axios.post(`${backendUrl}/api/ai/predict-disease`, {
        symptoms: finalInput,
      });

      if (data.success) {
        const result = {
          disease: data.disease,
          confidence: data.confidence,
          severity: data.severity,
          advice: data.advice,
        };

        setPrediction(result);

        const assistantReply = {
          role: "assistant",
          text: `Based on the symptoms, the most likely condition is "${data.disease}". I’ve also added recommended doctors below.`,
        };

        setMessages((prev) => [...prev, assistantReply]);

        // 2) doctor recommendation API
        // Expected response example:
        // {
        //   success: true,
        //   doctors: [{ _id, name, speciality, image, experience, fees }]
        // }

        const doctorRes = await axios.post(
          `${backendUrl}/api/ai/recommend-doctors`,
          {
            disease: data.disease,
          }
        );

        if (doctorRes.data.success) {
          setRecommendedDoctors(doctorRes.data.doctors || []);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.message || "Sorry, I could not predict the disease.",
          },
        ]);
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
    setPrediction(null);
    setRecommendedDoctors([]);
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
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                AI-Powered Symptom Checker
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Disease Prediction & Doctor Recommendation
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Describe your symptoms in natural language, get an AI-based
                prediction, and see recommended doctors instantly.
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
          {/* Left Section */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Chat header */}
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

            {/* Symptom chips */}
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
            </div>

            {/* Chat messages */}
            <div className="h-[420px] overflow-y-auto px-4 py-4 sm:px-6">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
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

            {/* Input */}
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

          {/* Right Section */}
          <div className="space-y-6">
            {/* Prediction card */}
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
                    AI-generated health insight
                  </p>
                </div>
              </div>

              {prediction ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Predicted Disease</p>
                    <h4 className="mt-1 text-2xl font-bold text-slate-900">
                      {prediction.disease}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm text-slate-500">Confidence</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {prediction.confidence}%
                      </p>
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
                        Suggested Advice
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      {prediction.advice}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-amber-700">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-sm font-semibold">Important</span>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">
                      If symptoms are severe or worsening, consult a qualified
                      doctor immediately.
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

            {/* Recommended doctors */}
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
                    Based on predicted condition
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
                          className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-base font-semibold text-slate-900">
                            {doctor.name}
                          </h4>
                          <p className="text-sm text-indigo-600">
                            {doctor.speciality}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>Experience: {doctor.experience}</span>
                            <span>Fees: ₹{doctor.fees}</span>
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
                    Doctor recommendations will appear here after prediction.
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