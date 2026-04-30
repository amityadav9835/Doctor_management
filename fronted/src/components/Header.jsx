import React from "react";
import { assets } from "../assets/assets_frontend/assets";

export default function Header() {
  return (
    <section className="mt-6 px-4 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1e3a8a_0%,#2563eb_48%,#0f766e_100%)] px-6 shadow-2xl shadow-blue-900/20 md:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(34,211,238,0.24),transparent_24%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950/20 to-transparent" />

        <div className="relative flex flex-col md:flex-row items-center">
          <div className="animate-fade-up flex flex-col items-start justify-center gap-5 py-12 md:w-1/2 md:py-20">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50 backdrop-blur">
              Modern care, simpler booking
            </span>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Book Appointments <br />
              <span className="text-cyan-100">With Trusted Doctors</span>
            </h1>

            <div className="animation-delay-100 animate-fade-up flex flex-col items-start gap-4 text-sm text-white/90 sm:flex-row sm:items-center sm:text-base">
              <img
                className="w-28"
                src={assets.group_profiles}
                alt="profiles"
              />
              <p className="leading-6">
                Browse trusted doctors, choose clinic or video consultations,
                and manage your appointments in one polished workspace.
              </p>
            </div>

            <div className="animation-delay-200 animate-fade-up mt-4 flex flex-col gap-4 sm:flex-row">
              <a
                href="#speciality"
                className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-950/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Book Appointment
                <img className="w-3" src={assets.arrow_icon} alt="" />
              </a>

              <button className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">
                Explore Doctors
              </button>
            </div>

            <div className="animation-delay-300 animate-fade-up mt-6 grid grid-cols-3 gap-3 text-sm text-white/90 sm:flex sm:gap-6">
              <div>
                <p className="text-lg font-bold text-white">100+</p>
                <p>Doctors</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">10k+</p>
                <p>Patients</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">24/7</p>
                <p>Support</p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 flex justify-center md:mt-0 md:w-1/2 md:justify-end">
            <div className="animate-pulse-soft absolute right-4 top-10 hidden rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur md:block">
              Online booking ready
            </div>
            <img
              className="animate-float-soft w-full max-w-md object-contain drop-shadow-2xl"
              src={assets.header_img}
              alt="Doctor"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
