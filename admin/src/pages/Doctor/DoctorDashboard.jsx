import React, { useContext, useEffect, useMemo } from "react";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorDashboard() {
  const { dToken, appointments = [], getAppointments } =
    useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(
      (item) => item.status === "pending"
    ).length;
    const confirmed = appointments.filter(
      (item) => item.status === "confirmed"
    ).length;
    const completed = appointments.filter(
      (item) => item.status === "completed"
    ).length;
    const cancelled = appointments.filter(
      (item) => item.status === "cancelled"
    ).length;

    const totalRevenue = appointments
      .filter((item) => item.status === "completed")
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue,
    };
  }, [appointments]);

  const recentAppointments = [...appointments].slice(0, 5);

  const getBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "cancelled":
        return "bg-red-50 text-red-600 border border-red-100";
      case "confirmed":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      default:
        return "bg-amber-50 text-amber-600 border border-amber-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Doctor Dashboard
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-500">
            Welcome back. Here is an overview of your appointments and activity.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Total Revenue
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-800">
            ₹{stats.totalRevenue}
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Appointments</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Confirmed</p>
          <p className="mt-3 text-3xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Completed</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{stats.completed}</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Appointments */}
        <div className="xl:col-span-2 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Appointments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest patient booking activity
            </p>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📅
              </div>
              <h3 className="text-lg font-semibold text-slate-700">
                No appointments yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                New appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAppointments.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex flex-col gap-4 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                      {item.userData?.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.userData?.name || "Patient"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.userData?.email || "No email"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.slotDate || "N/A"} • {item.slotTime || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                    <p className="text-sm font-semibold text-slate-800">
                      ₹{item.amount || 0}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(
                        item.status || "pending"
                      )}`}
                    >
                      {(item.status || "pending").charAt(0).toUpperCase() +
                        (item.status || "pending").slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              Appointment Summary
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Completed</span>
                  <span className="font-semibold text-slate-700">
                    {stats.completed}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${
                        stats.total ? (stats.completed / stats.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Confirmed</span>
                  <span className="font-semibold text-slate-700">
                    {stats.confirmed}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${
                        stats.total ? (stats.confirmed / stats.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Pending</span>
                  <span className="font-semibold text-slate-700">
                    {stats.pending}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${
                        stats.total ? (stats.pending / stats.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Cancelled</span>
                  <span className="font-semibold text-slate-700">
                    {stats.cancelled}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${
                        stats.total ? (stats.cancelled / stats.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Quick Stats</h3>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Cancelled
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {stats.cancelled}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Earnings
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-800">
                  ₹{stats.totalRevenue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}