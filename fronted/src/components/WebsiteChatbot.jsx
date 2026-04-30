import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

const starterMessages = [
  {
    role: "assistant",
    text: "Hi, I can explain how to use this doctor appointment website. Ask about booking, doctors, AI disease prediction, profile, appointments, or video calls.",
  },
];

const quickQuestions = [
  "How do I book a doctor?",
  "What does AI Doctor do?",
  "How do I see my appointments?",
  "How do I update my profile?",
];

const websiteTopics = [
  {
    keywords: ["book", "appointment", "slot", "schedule", "consult"],
    route: "/doctors",
    label: "Find Doctors",
    answer:
      "To book an appointment, open All Doctors, choose a doctor or speciality, pick an available date and time, then confirm the booking from the appointment page.",
  },
  {
    keywords: ["doctor", "speciality", "specialist", "find", "search"],
    route: "/doctors",
    label: "All Doctors",
    answer:
      "The All Doctors page lists doctors by speciality. You can open a doctor profile to check experience, fees, availability, and then continue to booking.",
  },
  {
    keywords: ["ai", "predict", "disease", "symptom", "medicine", "triage"],
    route: "/predict",
    label: "AI Doctor",
    answer:
      "AI Doctor lets you enter symptoms, warning signs, duration, severity, and patient details. It gives a triage-level disease prediction, care level, supportive guidance, and matching doctors.",
  },
  {
    keywords: ["login", "register", "account", "sign", "create"],
    route: "/login",
    label: "Login",
    answer:
      "Create an account or log in before booking. After login, the website can save your profile and show your appointment history.",
  },
  {
    keywords: ["profile", "name", "phone", "address", "gender", "dob", "update"],
    route: "/my-profile",
    label: "My Profile",
    answer:
      "Use My Profile to update your personal information such as name, phone, address, gender, date of birth, and profile image.",
  },
  {
    keywords: ["my appointment", "appointments", "cancel", "history", "status"],
    route: "/my-appointments",
    label: "My Appointments",
    answer:
      "My Appointments shows your booked consultations. From there you can review appointment details, payment status, cancellation options, and video call access when available.",
  },
  {
    keywords: ["video", "call", "online", "meeting", "telemedicine"],
    route: "/my-appointments",
    label: "Appointments",
    answer:
      "Video calls are opened from My Appointments when an appointment has an active video meeting. Join from the appointment row at the scheduled time.",
  },
  {
    keywords: ["payment", "pay", "fees", "razorpay", "stripe", "price"],
    route: "/my-appointments",
    label: "Payments",
    answer:
      "Doctor fees are shown before booking. Payment actions and payment status are available from the appointment flow and My Appointments page.",
  },
  {
    keywords: ["contact", "support", "help", "clinic", "address"],
    route: "/contact",
    label: "Contact",
    answer:
      "Use Contact for clinic information and support. If symptoms are severe or worsening, contact emergency medical services instead of waiting for a website response.",
  },
  {
    keywords: ["about", "website", "function", "feature", "what can"],
    route: "/about",
    label: "About",
    answer:
      "This website helps patients browse doctors, book appointments, manage profile details, track appointments, use AI symptom triage, and join online consultations when available.",
  },
];

const fallbackAnswer =
  "I can help with website features: booking doctors, AI disease prediction, login, profile, appointments, payments, video calls, and contact details. Try asking, 'How do I book an appointment?'";

const getBotReply = (message) => {
  const lowerMessage = message.toLowerCase();
  const topic = websiteTopics.find((item) =>
    item.keywords.some((keyword) => lowerMessage.includes(keyword))
  );

  return topic || { answer: fallbackAnswer };
};

export default function WebsiteChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(starterMessages);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const lastSuggestedRoute = useMemo(() => {
    const lastAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant" && message.route);

    return lastAssistant;
  }, [messages]);

  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = (text = input) => {
    const finalText = text.trim();
    if (!finalText) return;

    const reply = getBotReply(finalText);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: finalText },
      {
        role: "assistant",
        text: reply.answer,
        route: reply.route,
        label: reply.label,
      },
    ]);
    setInput("");
    setOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const goToRoute = (route) => {
    navigate(route);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open && (
        <div className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Website Assistant</p>
                <p className="text-xs text-slate-300">Feature guide</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-200 transition hover:bg-white/10"
              title="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                      message.role === "user"
                        ? "rounded-tr-md bg-indigo-600 text-white"
                        : "rounded-tl-md bg-slate-100 text-slate-700"
                    }`}
                  >
                    {message.text}
                    {message.route && (
                      <button
                        onClick={() => goToRoute(message.route)}
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                      >
                        {message.label}
                        <ChevronDown className="h-3 w-3 -rotate-90" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-100 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask how this website works..."
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
              <button
                onClick={() => sendMessage()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {lastSuggestedRoute && (
              <button
                onClick={() => goToRoute(lastSuggestedRoute.route)}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Open {lastSuggestedRoute.label}
                <ChevronDown className="h-3 w-3 -rotate-90" />
              </button>
            )}
          </div>
        </div>
      )}

      {!open && (
        <div className="mb-3 hidden max-w-xs rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-lg sm:block">
          <div className="flex items-start gap-2">
            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
            <span>Need help using the website?</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transition hover:-translate-y-0.5 hover:bg-indigo-700"
        title="Open website assistant"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {!open && (
        <div className="pointer-events-none absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
          <Sparkles className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
