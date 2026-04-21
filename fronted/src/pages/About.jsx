import React from "react";
import { assets } from "../assets/assets_frontend/assets";

export default function About() {
  return (
    <section className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1 text-xs sm:text-sm font-medium text-indigo-700">
            About Prescripto
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
            Making Healthcare Access
            <span className="block text-indigo-600 mt-1">
              Simple, Fast, and Reliable
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-500 leading-7">
            We help users discover trusted doctors, book appointments smoothly,
            and manage healthcare needs with a modern and user-friendly
            experience.
          </p>
        </div>

        {/* Top Section */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="order-1">
            <div className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm">
              <img
                src={assets.about_image}
                alt="About Prescripto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Who We Are
              </h2>

              <div className="mt-5 space-y-5 text-slate-600 text-sm sm:text-base leading-7">
                <p>
                  Welcome to Prescripto, your trusted partner in managing
                  healthcare needs conveniently and efficiently. We understand
                  the challenges people face when scheduling doctor appointments
                  and keeping their care journey organized.
                </p>

                <p>
                  Prescripto is committed to excellence in healthcare
                  technology. We continuously improve our platform to deliver a
                  better experience, helping users book appointments with ease
                  and connect with trusted healthcare professionals faster.
                </p>

                <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Our Vision
                  </h3>
                  <p className="text-slate-600 leading-7">
                    Our vision is to create a seamless healthcare experience for
                    every user by bridging the gap between patients and doctors,
                    making care accessible whenever it is needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-14 sm:mt-16 lg:mt-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Why Choose Us
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500 leading-7">
              Built for convenience, designed for trust, and optimized for a
              smooth healthcare experience on every device.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                01
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                Efficiency
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-7">
                Streamlined appointment scheduling that fits naturally into your
                busy lifestyle and saves your valuable time.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                02
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                Convenience
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-7">
                Easy access to a trusted network of healthcare professionals,
                helping you find the right doctor without stress.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-lg">
                03
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                Personalization
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-7">
                Tailored recommendations and timely reminders to help you stay
                informed and in control of your healthcare journey.
              </p>
            </div>
          </div>
        </div>

        {/* Optional trust strip */}
        <div className="mt-14 sm:mt-16">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-6 sm:px-8 sm:py-7">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  100+
                </p>
                <p className="mt-1 text-sm text-slate-500">Trusted Doctors</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  10k+
                </p>
                <p className="mt-1 text-sm text-slate-500">Appointments Booked</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  24/7
                </p>
                <p className="mt-1 text-sm text-slate-500">Easy Access</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Secure
                </p>
                <p className="mt-1 text-sm text-slate-500">User Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}