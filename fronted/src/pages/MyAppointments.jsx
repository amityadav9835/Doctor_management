import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Appcontext } from "../context/Appccontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function MyAppointments() {
  const { backendUrl, token, currencysymbol } = useContext(Appcontext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState("");
  const [payLoadingId, setPayLoadingId] = useState("");

  const navigate = useNavigate();

  const authConfig = useMemo(
    () => ({
      headers: { token },
    }),
    [token]
  );

  const getUserAppointments = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        authConfig
      );

      if (data.success) {
        setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
        return;
      }

      toast.error(data.message || "Failed to fetch appointments");
    } catch (error) {
      console.error("Fetch appointments error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancelLoadingId(appointmentId);

      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        authConfig
      );

      if (data.success) {
        toast.success(data.message || "Appointment cancelled successfully");
        await getUserAppointments();
        return;
      }

      toast.error(data.message || "Unable to cancel appointment");
    } catch (error) {
      console.error("Cancel appointment error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setCancelLoadingId("");
    }
  };

  const cleanKey = (key = "") => key.trim().replace(/^['"]|['"]$/g, "").trim();

  const initPay = (order, appointmentId, keyId) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const razorpayKey = cleanKey(keyId || import.meta.env.VITE_TEST_API_KEY);

    if (!razorpayKey) {
      toast.error("Razorpay key is missing");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Doctor Appointment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      prefill: {
        name: "Patient",
      },
      notes: {
        appointmentId,
      },
      theme: {
        color: "#4f46e5",
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment window closed");
        },
      },
      handler: async function (response) {
        try {
          const verifyPayload = {
            appointmentId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razorpay`,
            verifyPayload,
            authConfig
          );

          if (data.success) {
            toast.success(data.message || "Payment successful");
            await getUserAppointments();
            return;
          }

          toast.error(data.message || "Payment verification failed");
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error(error.response?.data?.message || error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      toast.error(response.error?.description || "Payment failed");
    });

    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      setPayLoadingId(appointmentId);

      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        authConfig
      );

      if (data.success) {
        initPay(data.order, appointmentId, data.keyId);
        return;
      }

      console.error("Payment order failed:", data);
      toast.error(
        data.message ||
          data.error?.description ||
          data.code ||
          "Unable to create payment order"
      );
    } catch (error) {
      console.error("Create payment order error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error?.description ||
          error.message
      );
    } finally {
      setPayLoadingId("");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getUserAppointments();
  }, [token, navigate]);

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

  const canShowPayButton = (item) =>
    !item.payment &&
    item.status !== "cancelled" &&
    item.status !== "completed";

  const canShowCancelButton = (item) =>
    item.status !== "cancelled" && item.status !== "completed";

  const canJoinVideoCall = (item) =>
    item.consultationType === "video" &&
    item.videoJoin?.allowed &&
    item.meetingUrl;

  const getVideoCallMessage = (item) => {
    if (item.consultationType !== "video") return "";
    if (item.videoJoin?.reason) return item.videoJoin.reason;
    if (item.status === "cancelled") return "Video call cancelled";
    if (item.status === "completed") return "Video call completed";
    if (!item.payment) return "Pay appointment fee to unlock video call";
    if (!item.meetingUrl) return "Video link is being prepared. Refresh once.";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            My Appointments
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Manage your upcoming consultations, review appointment details, complete payments, and cancel bookings when needed.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
              >
                <div className="flex flex-col gap-5 md:flex-row">
                  <div className="h-32 w-32 rounded-xl bg-slate-200" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/3 rounded bg-slate-200" />
                    <div className="h-4 w-1/4 rounded bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                  <div className="h-24 w-40 rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length > 0 ? (
          <div className="grid gap-6">
            {appointments.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex justify-center lg:justify-start">
                      <img
                        className="h-32 w-32 rounded-2xl border border-slate-100 bg-indigo-50 object-cover sm:h-36 sm:w-36"
                        src={item.docData?.image || "/placeholder-doctor.png"}
                        alt={item.docData?.name || "Doctor"}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-800 sm:text-2xl">
                            {item.docData?.name || "Doctor Name"}
                          </h2>
                          <p className="mt-1 font-medium text-indigo-600">
                            {item.docData?.speciality || "Speciality not available"}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {item.status
                            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                            : "Unknown"}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="font-medium text-slate-500">Address</p>
                          <p className="mt-1 text-slate-700">
                            {item.docData?.address?.line1 || "No address available"}
                          </p>
                          {item.docData?.address?.line2 && (
                            <p className="text-slate-700">{item.docData.address.line2}</p>
                          )}
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="font-medium text-slate-500">Appointment Time</p>
                          <p className="mt-1 text-slate-700">
                            {item.slotDate || "N/A"} | {item.slotTime || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="font-medium text-slate-500">Consultation Fees</p>
                          <p className="mt-1 font-semibold text-slate-800">
                            {currencysymbol}
                            {item.amount ?? 0}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="font-medium text-slate-500">Payment</p>
                          <p
                            className={`mt-1 font-semibold ${
                              item.payment ? "text-green-600" : "text-orange-500"
                            }`}
                          >
                            {item.payment ? "Paid" : "Pending"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="font-medium text-slate-500">
                            Consultation
                          </p>
                          <p className="mt-1 font-semibold text-slate-800">
                            {item.consultationType === "video"
                              ? "Virtual Video Call"
                              : "Clinic Visit"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-3 lg:w-56">
                      {canJoinVideoCall(item) && (
                        <button
                          onClick={() => navigate(`/video-call/${item._id}`)}
                          className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 transition-all duration-300 hover:bg-emerald-600 hover:text-white"
                        >
                          Join Video Call
                        </button>
                      )}

                      {!canJoinVideoCall(item) && getVideoCallMessage(item) && (
                        <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                          {getVideoCallMessage(item)}
                        </div>
                      )}

                      {canShowPayButton(item) && (
                        <button
                          onClick={() => appointmentRazorpay(item._id)}
                          disabled={payLoadingId === item._id}
                          className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {payLoadingId === item._id ? "Processing..." : "Pay Online"}
                        </button>
                      )}

                      {canShowCancelButton(item) ? (
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          disabled={cancelLoadingId === item._id}
                          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancelLoadingId === item._id
                            ? "Cancelling..."
                            : "Cancel Appointment"}
                        </button>
                      ) : item.status === "cancelled" ? (
                        <button
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500"
                        >
                          Appointment Cancelled
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full cursor-not-allowed rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600"
                        >
                          Appointment Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl">
              📅
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              No appointments found
            </h2>
            <p className="mt-2 text-slate-500">
              You have not booked any appointments yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
