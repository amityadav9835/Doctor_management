import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appccontext";

export default function Doctor() {
  const { speciality } = useParams();
  const { doctors } = useContext(Appcontext);
  const navigate = useNavigate();

  const [filterdoc, setfilterdoc] = useState([]);

  const categories = useMemo(
    () => [
      "General physician",
      "Gynecologist",
      "Dermatologist",
      "Pediatricians",
      "Neurologist",
      "Gastroenterologist",
    ],
    []
  );

  useEffect(() => {
    if (speciality) {
      setfilterdoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setfilterdoc(doctors);
    }
  }, [doctors, speciality]);

  const handleCategoryClick = (cat) => {
    if (speciality === cat) {
      navigate("/doctors");
    } else {
      navigate(`/doctors/${cat}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDoctorClick = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1 text-xs sm:text-sm font-medium text-indigo-700">
            Find Your Specialist
          </span>

          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
            Browse Through Our Specialist Doctors
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl leading-6">
            Explore trusted doctors by speciality, compare availability, and
            book the right appointment with a clean and simple experience.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters */}
          <aside className="lg:w-72 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                    Categories
                  </h2>

                  {speciality && (
                    <button
                      onClick={() => {
                        navigate("/doctors");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Mobile chips */}
                <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                        speciality === cat
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Desktop list */}
                <div className="hidden lg:flex flex-col gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${
                        speciality === cat
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-indigo-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Doctors content */}
          <div className="flex-1">
            {/* Top summary */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-4 sm:px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Showing doctors</p>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                  {speciality ? speciality : "All Specialities"}
                </h3>
              </div>

              <div className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 w-fit">
                {filterdoc.length} doctor{filterdoc.length !== 1 ? "s" : ""} found
              </div>
            </div>

            {/* Grid */}
            {filterdoc.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filterdoc.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleDoctorClick(item._id)}
                    className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Image area */}
                    <div className="relative bg-indigo-50">
                      <img
                        className="w-full h-52 sm:h-56 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        src={item.image}
                        alt={item.name}
                      />

                      <span
                        className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${
                          item.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.available ? "● Available" : "● Not Available"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-indigo-600 font-medium mt-1">
                            {item.speciality}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Experience</span>
                        <span className="text-slate-700 font-medium">
                          {item.experience || "5+ yrs"}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Consultation</span>
                        <span className="text-slate-700 font-medium">
                          {item.fees ? `₹${item.fees}` : "Contact"}
                        </span>
                      </div>

                      <button
                        className="mt-5 w-full rounded-2xl bg-indigo-50 text-indigo-700 py-3 font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDoctorClick(item._id);
                        }}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                  🩺
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-800">
                  No doctors found
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-md mx-auto">
                  We could not find doctors for this category right now. Try
                  another speciality or view all doctors.
                </p>
                <button
                  onClick={() => {
                    navigate("/doctors");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-6 rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-all"
                >
                  View All Doctors
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}