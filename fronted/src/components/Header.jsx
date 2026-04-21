import React from "react";
import { assets } from "../assets/assets_frontend/assets";

export default function Header() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-6">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 md:px-10 lg:px-16 shadow-xl">
        
        {/* Glow effects */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-52 h-52 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row items-center">
          
          {/* LEFT SIDE */}
          <div className="md:w-1/2 flex flex-col items-start justify-center gap-5 py-12 md:py-20">
            
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Book Appointments <br />
              <span className="text-cyan-100">With Trusted Doctors</span>
            </h1>

            {/* Description */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-white/90 text-sm sm:text-base">
              <img
                className="w-28"
                src={assets.group_profiles}
                alt="profiles"
              />
              <p className="leading-6">
                Browse through our list of trusted doctors and schedule your
                appointment quickly and hassle-free.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a
                href="#speciality"
                className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-slate-800 text-sm font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Book Appointment
                <img className="w-3" src={assets.arrow_icon} alt="" />
              </a>

              <button className="flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur px-8 py-3 rounded-full text-white text-sm font-semibold hover:bg-white/20 transition-all duration-300">
                Explore Doctors
              </button>
            </div>

            {/* Trust Stats */}
            <div className="flex gap-6 mt-6 text-white/90 text-sm">
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

          {/* RIGHT SIDE */}
          <div className="md:w-1/2 relative flex justify-center md:justify-end mt-8 md:mt-0">
            <img
              className="w-full max-w-md object-contain drop-shadow-2xl"
              src={assets.header_img}
              alt="Doctor"
            />
          </div>
        </div>
      </div>
    </section>
  );
}