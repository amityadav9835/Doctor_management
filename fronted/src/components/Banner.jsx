import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

export default function Banner() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="my-16 sm:my-20">
      <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#0f766e_100%)] px-6 shadow-2xl shadow-slate-900/20 sm:px-10 md:px-14 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.22),transparent_24%)]" />

        <div className="relative flex flex-col items-center md:flex-row">
          <div className="animate-fade-up flex-1 py-10 sm:py-14 md:py-16 lg:py-20">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium text-white/90 backdrop-blur sm:text-sm">
              Trusted Healthcare Platform
            </span>

            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Book appointments with
              <span className="mt-2 block text-cyan-100">
                verified specialists
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
              Connect with experienced doctors, select the right consultation
              mode, and keep your care journey organized in one place.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleNavigate}
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-950/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:text-base"
              >
                Create Account
              </button>

              <button
                onClick={() => window.scrollTo({ top: 650, behavior: "smooth" })}
                className="rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 sm:text-base"
              >
                Explore Doctors
              </button>
            </div>
          </div>

          <div className="hidden self-end md:flex md:w-1/2 md:justify-end lg:w-[420px]">
            <img
              className="animate-float-soft w-full max-w-md object-contain drop-shadow-2xl"
              src={assets.appointment_img}
              alt="Doctor appointment"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
