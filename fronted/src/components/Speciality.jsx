import React from "react";
import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets_frontend/assets";

export default function Speciality() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="speciality" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="animate-fade-up text-center">
          <span className="rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Care categories
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            Find by Speciality
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Browse trusted medical specialities and find the right doctor for
            clinic visits, virtual appointments, or follow-up care.
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <div className="flex gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-6">
            {specialityData.map((item, index) => (
              <Link
                key={item.speciality}
                to={`/doctors/${item.speciality}`}
                onClick={handleScrollTop}
                className="professional-card group flex min-w-[110px] flex-col items-center rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl sm:min-w-0 sm:p-5"
                style={{ animation: `fadeUp 0.55s ease ${index * 0.04}s both` }}
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 sm:h-20 sm:w-20">
                  <img
                    className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
                    src={item.image}
                    alt={item.speciality}
                  />
                </div>
                <p className="mt-3 text-xs font-medium leading-5 text-slate-700 sm:text-sm">
                  {item.speciality}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
