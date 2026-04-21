import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const {
    doctors = [],
    aToken,
    getAllDoctors,
    backendUrl,
    changeAvailability,
  } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            All Doctors
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Manage doctor profiles and update their availability status.
          </p>
        </div>

        {Array.isArray(doctors) && doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {doctors.map((item) => (
              <div
                key={item._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative bg-indigo-50">
                  <img
                    className="h-[280px] w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${backendUrl}/${item.image}`
                    }
                    alt={item.name}
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                        item.available
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm sm:text-base text-slate-500">
                      {item.speciality}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Availability
                      </p>
                      <p className="text-xs text-slate-500">
                        Toggle doctor status
                      </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => changeAvailability(item._id)}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl">
              👨‍⚕️
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              No doctors found
            </h2>
            <p className="mt-2 text-slate-500">
              There are no doctor records available right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;