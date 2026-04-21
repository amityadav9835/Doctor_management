import React from "react";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";

export default function Speciality() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="speciality"
      className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
            Find by Speciality
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-6">
            Browse through our trusted medical specialities and find the right
            doctor for your needs with a smooth booking experience.
          </p>
        </div>

        {/* Mobile: horizontal scroll | Desktop: grid */}
        <div className="mt-8 sm:mt-10">
          <div className="flex gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-5 scrollbar-hide">
            {specialityData.map((item, index) => (
              <Link
                key={index}
                to={`/doctors/${item.speciality}`}
                onClick={handleScrollTop}
                className="min-w-[110px] sm:min-w-0 group flex flex-col items-center text-center bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden">
                  <img
                    className="w-10 h-10 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                    src={item.image}
                    alt={item.speciality}
                  />
                </div>

                <p className="mt-3 text-xs sm:text-sm font-medium text-slate-700 leading-5">
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