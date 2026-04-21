import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorAppointment() {
  const { dToken, appointments, getAppointments, updateStatus } =
    useContext(DoctorContext);

  const [statusMap, setStatusMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const handleStatusChange = (id, value) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getCurrentStatus = (item) => {
    return item.status || "pending";
  };

  const handleUpdate = async (appointmentId, item) => {
    const selectedStatus = statusMap[appointmentId] || getCurrentStatus(item);

    try {
      setLoadingId(appointmentId);
      await updateStatus(appointmentId, selectedStatus);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Doctor Appointments
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Manage appointments and update patient visit status
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="min-w-[120px] rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {appointments?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="hidden grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-600 md:grid">
          <p className="col-span-1">#</p>
          <p className="col-span-3">Patient</p>
          <p className="col-span-2">Schedule</p>
          <p className="col-span-1">Fees</p>
          <p className="col-span-2">Current</p>
          <p className="col-span-3">Update</p>
        </div>

        {!appointments || appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              📅
            </div>
            <h2 className="text-lg font-semibold text-slate-700">
              No appointments found
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              When patients book appointments, they will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((item, index) => {
              const currentStatus = getCurrentStatus(item);

              const badgeClass =
                currentStatus === "cancelled"
                  ? "border border-red-100 bg-red-50 text-red-600"
                  : currentStatus === "completed"
                  ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                  : currentStatus === "confirmed"
                  ? "border border-blue-100 bg-blue-50 text-blue-600"
                  : "border border-amber-100 bg-amber-50 text-amber-600";

              return (
                <div
                  key={item._id}
                  className="px-4 py-4 transition hover:bg-slate-50 sm:px-6"
                >
                  {/* Desktop View */}
                  <div className="hidden grid-cols-12 items-center gap-4 md:grid">
                    <p className="col-span-1 text-sm font-medium text-slate-500">
                      {index + 1}
                    </p>

                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.userData?.name || "Patient"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.userData?.email || "No email"}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-sm font-medium text-slate-700">
                        {item.slotDate || "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.slotTime || "N/A"}
                      </p>
                    </div>

                    <div className="col-span-1">
                      <p className="text-sm font-semibold text-slate-800">
                        ₹{item.amount || 0}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                      >
                        {currentStatus.charAt(0).toUpperCase() +
                          currentStatus.slice(1)}
                      </span>
                    </div>

                    <div className="col-span-3 flex items-center gap-2">
                      <select
                        value={statusMap[item._id] || currentStatus}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleUpdate(item._id, item)}
                        disabled={loadingId === item._id}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingId === item._id ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-800">
                          {item.userData?.name || "Patient"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.userData?.email || "No email"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${badgeClass}`}
                      >
                        {currentStatus.charAt(0).toUpperCase() +
                          currentStatus.slice(1)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 px-3 py-3">
                        <p className="text-xs font-medium text-slate-500">
                          Date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {item.slotDate || "N/A"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-3 py-3">
                        <p className="text-xs font-medium text-slate-500">
                          Time
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {item.slotTime || "N/A"}
                        </p>
                      </div>

                      <div className="col-span-2 rounded-xl bg-slate-50 px-3 py-3">
                        <p className="text-xs font-medium text-slate-500">
                          Fees
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          ₹{item.amount || 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                      <select
                        value={statusMap[item._id] || currentStatus}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleUpdate(item._id, item)}
                        disabled={loadingId === item._id}
                        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingId === item._id ? "Updating..." : "Update Status"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}