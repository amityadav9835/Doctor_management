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
    <section className="px-4 sm:px-6 lg:px-8 my-12 sm:my-16">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
          Top Doctors to Book
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
          Browse top-rated doctors and book your appointment instantly with ease.
        </p>

        {/* Doctors */}
        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-6 scrollbar-hide">
            {doctors.slice(0, 10).map((item) => (
              <div
                key={item._id}
                onClick={() => handleNavigate(item._id)}
                className="min-w-[220px] sm:min-w-0 group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative bg-indigo-50">
                  <img
                    className="w-full h-44 object-contain p-3 group-hover:scale-105 transition-all duration-300"
                    src={item.image}
                    alt={item.name}
                  />

                  {/* Availability badge */}
                  <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
                      item.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.available ? "● Available" : "● Not Available"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 text-left">
                  <h3 className="text-base font-semibold text-slate-800 truncate">
                    {item.name}
                  </h3>

                  <p className="text-sm text-indigo-600 font-medium mt-1">
                    {item.speciality}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Experience</span>
                    <span className="text-slate-700 font-medium">
                      {item.experience || "5+ yrs"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="mt-10">
          <button
            onClick={() => {
              navigate("/doctors");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-10 py-3 rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View All Doctors →
          </button>
        </div>
      </div>
    </section>
  );
}