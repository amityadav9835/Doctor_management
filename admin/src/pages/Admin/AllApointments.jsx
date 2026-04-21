import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const AllApointments = () => {
  const { aToken, appointments, getAllAppointments, backendUrl } =
    useContext(AdminContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusLoadingId, setStatusLoadingId] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return appointments;

    return appointments.filter((item) =>
      [
        item.userData?.name,
        item.docData?.name,
        item.docData?.speciality,
        item.slotDate,
        item.slotTime,
        item.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      setStatusLoadingId(appointmentId);

      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-appointment-status`,
        { appointmentId, status },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message || "Status updated successfully");
        await getAllAppointments();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update appointment status error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setStatusLoadingId("");
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getSelectClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                All Appointments
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                View and manage all patient appointments from the admin panel.
              </p>
            </div>

            <div className="w-full lg:w-80">
              <input
                type="text"
                placeholder="Search by patient, doctor, date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Total Appointments</p>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">
              {appointments.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-600 mt-2">
              {appointments.filter((item) => item.status === "pending").length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Completed</p>
            <h2 className="text-2xl font-bold text-blue-600 mt-2">
              {appointments.filter((item) => item.status === "completed").length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-slate-500 text-sm">Cancelled</p>
            <h2 className="text-2xl font-bold text-red-600 mt-2">
              {appointments.filter((item) => item.status === "cancelled").length}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">
              Appointment Records
            </h3>
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-sm text-slate-600">
                    <th className="px-6 py-4 font-semibold">#</th>
                    <th className="px-6 py-4 font-semibold">Patient</th>
                    <th className="px-6 py-4 font-semibold">Doctor</th>
                    <th className="px-6 py-4 font-semibold">Date & Time</th>
                    <th className="px-6 py-4 font-semibold">Fees</th>
                    <th className="px-6 py-4 font-semibold">Payment</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.userData?.image || "https://via.placeholder.com/40"}
                            alt={item.userData?.name || "Patient"}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-medium text-slate-800">
                              {item.userData?.name || "Unknown Patient"}
                            </p>
                            <p className="text-xs text-slate-500">Patient</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">
                            {item.docData?.name || "Unknown Doctor"}
                          </p>
                          <p className="text-xs text-indigo-600">
                            {item.docData?.speciality || "Speciality not available"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        <p>{item.slotDate || "N/A"}</p>
                        <p className="text-slate-500">{item.slotTime || "N/A"}</p>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        ₹{item.amount}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            item.payment
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-orange-100 text-orange-700 border-orange-200"
                          }`}
                        >
                          {item.payment ? "Paid" : "Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <select
                            value={item.status || "pending"}
                            onChange={(e) =>
                              updateAppointmentStatus(item._id, e.target.value)
                            }
                            disabled={statusLoadingId === item._id}
                            className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none transition ${getSelectClasses(
                              item.status
                            )} ${
                              statusLoadingId === item._id
                                ? "opacity-60 cursor-not-allowed"
                                : "focus:ring-2 focus:ring-indigo-200"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <span
                            className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                              item.status
                            )}`}
                          >
                            {statusLoadingId === item._id
                              ? "Updating..."
                              : item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "Unknown"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                📅
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mt-4">
                No appointments found
              </h2>
              <p className="text-slate-500 mt-2">
                There are no appointment records available right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllApointments;