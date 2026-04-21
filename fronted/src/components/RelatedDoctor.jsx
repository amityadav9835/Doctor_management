import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../context/Appccontext";
import { useNavigate } from "react-router-dom";

export default function RelatedDoctor({ speciality, docId }) {
  const { doctors } = useContext(Appcontext);
  const [reldoc, setreldoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctordata = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setreldoc(doctordata);
    }
  }, [doctors, speciality, docId]);

  const handleNavigate = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="my-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
          Related Doctors
        </h2>

        <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Discover more trusted specialists in the same category to find the best care for you.
        </p>

        {/* Doctors Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {reldoc.slice(0, 5).map((item) => (
            <div
              key={item._id}
              onClick={() => handleNavigate(item._id)}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative bg-indigo-50">
                <img
                  className="w-full h-48 object-contain p-3 group-hover:scale-105 transition-all duration-300"
                  src={item.image}
                  alt={item.name}
                />

                {/* Availability Badge */}
                <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ● Available
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
                  <span className="text-slate-500">
                    Experience
                  </span>
                  <span className="text-slate-700 font-medium">
                    {item.experience || "5+ yrs"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        {reldoc.length > 5 && (
          <div className="mt-12">
            <button
              onClick={() => {
                navigate("/doctors");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-10 py-3 rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              View More Doctors →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}