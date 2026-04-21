import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="my-16 sm:my-20">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 sm:px-10 md:px-14 lg:px-16 shadow-xl">
        {/* Background glow */}
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row items-center">
          {/* Left Side */}
          <div className="flex-1 py-10 sm:py-14 md:py-16 lg:py-20">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs sm:text-sm font-medium text-white/90 backdrop-blur">
              Trusted Healthcare Platform
            </span>

            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white max-w-xl">
              Book appointments with
              <span className="block mt-2 text-cyan-100">100+ trusted doctors</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm sm:text-base leading-7 text-white/85">
              Connect with experienced specialists, choose your preferred time
              slot, and manage your appointments with ease in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleNavigate}
                className="rounded-full bg-white px-8 py-3 text-sm sm:text-base font-semibold text-slate-800 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Create Account
              </button>

              <button
                onClick={() => window.scrollTo({ top: 650, behavior: "smooth" })}
                className="rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20"
              >
                Explore Doctors
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-white/90 text-sm">
              <div>
                <p className="text-lg font-bold text-white">100+</p>
                <p>Verified Doctors</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">24/7</p>
                <p>Easy Booking</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">Secure</p>
                <p>Trusted Platform</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex md:w-1/2 lg:w-[420px] justify-end self-end">
            <img
              className="w-full max-w-md object-contain drop-shadow-2xl"
              src={assets.appointment_img}
              alt="Doctor appointment"
            />
          </div>
        </div>
      </div>
    </section>
  );
}