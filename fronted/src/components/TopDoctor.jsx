import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appccontext";

export default function TopDoctor() {
  const navigate = useNavigate();
  const { doctors } = useContext(Appcontext);

  const handleNavigate = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="my-12 px-4 sm:my-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <div className="animate-fade-up">
          <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
            Trusted specialists
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            Top Doctors to Book
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Browse top-rated doctors and book clinic or video appointments with
            a smoother, more confident experience.
          </p>
        </div>

        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {doctors.slice(0, 10).map((item, index) => (
              <button
                key={item._id}
                onClick={() => handleNavigate(item._id)}
                className="professional-card group min-w-[220px] cursor-pointer overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl sm:min-w-0"
                style={{ animation: `fadeUp 0.55s ease ${index * 0.05}s both` }}
              >
                <div className="relative bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50">
                  <img
                    className="h-44 w-full object-contain p-3 transition-all duration-300 group-hover:scale-105"
                    src={item.image}
                    alt={item.name}
                  />

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      item.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.available ? "Available" : "Not Available"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-indigo-600">
                    {item.speciality}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Experience</span>
                    <span className="font-medium text-slate-700">
                      {item.experience || "5+ yrs"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={() => {
              navigate("/doctors");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-10 py-3 font-semibold text-indigo-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:text-white hover:shadow-lg"
          >
            View All Doctors
          </button>
        </div>
      </div>
    </section>
  );
}
