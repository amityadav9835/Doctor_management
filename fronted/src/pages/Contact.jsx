import React from "react";
import { assets } from "../assets/assets_frontend/assets";

export default function Contact() {
  return (
    <section className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1 text-xs sm:text-sm font-medium text-indigo-700">
            Contact Prescripto
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
            We’d Love to
            <span className="block text-indigo-600 mt-1">Hear From You</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-500 leading-7">
            Have questions, need support, or want to know more about our
            platform? Reach out to us and our team will be happy to assist you.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Image */}
          <div>
            <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src={assets.contact_image}
                alt="Contact Prescripto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-6">
            {/* Office Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg font-bold">
                📍
              </div>

              <h2 className="mt-5 text-xl sm:text-2xl font-bold text-slate-800">
                Our Office
              </h2>

              <div className="mt-4 text-sm sm:text-base text-slate-600 leading-7">
                <p>
                  54709 Willms Station <br />
                  Suite 350, Washington, USA
                </p>

                <div className="mt-5 space-y-2">
                  <p>
                    <span className="font-semibold text-slate-800">Phone:</span>{" "}
                    (415) 555-0132
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Email:</span>{" "}
                    greatstackdev@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Careers Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg font-bold">
                💼
              </div>

              <h2 className="mt-5 text-xl sm:text-2xl font-bold text-slate-800">
                Careers at Prescripto
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-7">
                Learn more about our team, our culture, and current job openings.
                Join us in building a better healthcare experience for everyone.
              </p>

              <button className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all duration-300">
                Explore Jobs
              </button>
            </div>

            {/* Quick Support Strip */}
            <div className="bg-indigo-600 rounded-3xl shadow-sm p-6 sm:p-8 text-white">
              <h3 className="text-xl font-bold">Need Quick Help?</h3>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-7">
                Our support team is here to guide you with appointment booking,
                account issues, and platform-related questions.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-slate-100 transition-all">
                  Contact Support
                </button>

                <button className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all">
                  Help Center
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}