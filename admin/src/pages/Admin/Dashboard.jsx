import React, { useContext, useEffect, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";

const Dashboard = () => {
  const {
    aToken,
    doctors,
    appointments,
    getAllDoctors,
    getAllAppointments,
  } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      getAllAppointments();
    }
  }, [aToken]);

  const totalPatients = useMemo(() => {
    const uniquePatients = new Set(
      appointments.map((item) => item.userId || item.userData?._id)
    );
    return uniquePatients.size;
  }, [appointments]);

  const paidAppointments = useMemo(() => {
    return appointments.filter((item) => item.payment).length;
  }, [appointments]);

  const pendingAppointments = useMemo(() => {
    return appointments.filter((item) => item.status === "pending").length;
  }, [appointments]);

  const completedAppointments = useMemo(() => {
    return appointments.filter((item) => item.status === "completed").length;
  }, [appointments]);

  const recentAppointments = useMemo(() => {
    appointments.reverse();
    return [...appointments].slice(0, 5);
  }, [appointments]);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Monitor doctors, patients, appointments, and payment activity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Total Doctors</p>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">
              {doctors.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Total Appointments</p>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">
              {appointments.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Total Patients</p>
            <h2 className="text-2xl font-bold text-indigo-600 mt-2">
              {totalPatients}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Paid Appointments</p>
            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {paidAppointments}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Pending Appointments</p>
            <h2 className="text-2xl font-bold text-yellow-600 mt-2">
              {pendingAppointments}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">
                Recent Appointments
              </h3>
            </div>

            {recentAppointments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentAppointments.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.userData?.image ||
                          "https://via.placeholder.com/48"
                        }
                        alt={item.userData?.name || "Patient"}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-medium text-slate-800">
                          {item.userData?.name || "Unknown Patient"}
                        </p>
                        <p className="text-sm text-slate-500">
                          with {item.docData?.name || "Unknown Doctor"}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-slate-600">
                      <p>{item.slotDate || "N/A"}</p>
                      <p className="text-slate-500">{item.slotTime || "N/A"}</p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          item.status === "confirmed"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : item.status === "completed"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {item.status
                          ? item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-500">
                No recent appointments found.
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-5">
              Quick Stats
            </h3>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Completed</p>
                <h4 className="text-xl font-bold text-blue-600 mt-1">
                  {completedAppointments}
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Available Doctors</p>
                <h4 className="text-xl font-bold text-green-600 mt-1">
                  {doctors.filter((doc) => doc.available).length}
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Unavailable Doctors</p>
                <h4 className="text-xl font-bold text-red-600 mt-1">
                  {doctors.filter((doc) => !doc.available).length}
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Unpaid Appointments</p>
                <h4 className="text-xl font-bold text-orange-600 mt-1">
                  {appointments.filter((item) => !item.payment).length}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Doctors Overview
          </h3>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {doctors.slice(0, 6).map((doc) => (
                <div
                  key={doc._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-4"
                >
                  <img
                    src={doc.image || "https://via.placeholder.com/56"}
                    alt={doc.name || "Doctor"}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {doc.name || "Unknown Doctor"}
                    </p>
                    <p className="text-sm text-indigo-600">
                      {doc.speciality || "Speciality not available"}
                    </p>
                    <span
                      className={`inline-flex mt-2 items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        doc.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {doc.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No doctors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;