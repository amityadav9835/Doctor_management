import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appccontext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctor from "../components/RelatedDoctor";
import { toast } from "react-toastify";
import axios from "axios";

export default function Appointment() {
  const { docId } = useParams();
  const { doctors, currencysymbol, backendUrl, token, DoctorsData } =
    useContext(Appcontext);
  const navigate = useNavigate();

  const daysofweek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docinfo, setdocinfo] = useState(null);
  const [docslots, setdocslots] = useState([]);
  const [slotindex, setslotindex] = useState(0);
  const [slottime, setslottime] = useState("");
  const [booking, setBooking] = useState(false);

  const fetchdocinfo = () => {
    const foundDoctor = doctors.find((doc) => doc._id === docId);
    setdocinfo(foundDoctor || null);
  };

  const formatSlotDate = (date) => {
    return (
      date.getDate() +
      "_" +
      (date.getMonth() + 1) +
      "_" +
      date.getFullYear()
    );
  };

  const isSlotBooked = (dateObj, time) => {
    if (!docinfo?.slots_booked) return false;

    const slotDate = formatSlotDate(dateObj);
    const bookedSlotsForDate = docinfo.slots_booked[slotDate] || [];

    return bookedSlotsForDate.includes(time);
  };

  const getAvailableSlots = () => {
    if (!docinfo) return;

    let slots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);

      let startTime = new Date(currentDate);
      let endTime = new Date(currentDate);

      startTime.setHours(8, 0, 0, 0);
      endTime.setHours(12, 0, 0, 0);

      let timeSlots = [];

      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          datetime: new Date(startTime),
          time: formattedTime,
          booked: isSlotBooked(currentDate, formattedTime),
        });

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setdocslots(slots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      navigate("/login");
      return;
    }

    if (!docslots.length || !docslots[slotindex]?.length) {
      toast.error("No slots available");
      return;
    }

    if (!slottime) {
      toast.error("Please select a time slot");
      return;
    }

    const selectedSlot = docslots[slotindex].find((slot) => slot.time === slottime);

    if (selectedSlot?.booked) {
      toast.error("This slot is already booked");
      return;
    }

    try {
      setBooking(true);

      const selectedDate = docslots[slotindex][0].datetime;
      const slotDate = formatSlotDate(selectedDate);

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime: slottime,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked successfully");
        await DoctorsData();
        setslottime("");
        navigate("/my-appointments");
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    fetchdocinfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
    setslottime("");
  }, [docinfo]);

  const selectedDayLabel = useMemo(() => {
    if (!docslots.length || !docslots[slotindex]?.length) return "";
    const d = docslots[slotindex][0].datetime;
    return `${daysofweek[d.getDay()]} , ${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()}`;
  }, [docslots, slotindex]);

  return (
    docinfo && (
      <div className="px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto py-8">
          {/* Doctor Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
            <div className="w-full bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-3xl overflow-hidden shadow-xl">
              <img
                src={docinfo.image}
                alt={docinfo.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
                  {docinfo.name}
                  <img src={assets.verified_icon} alt="" className="w-5" />
                </h2>
              </div>

              <p className="text-slate-500 mt-3 text-sm sm:text-base">
                {docinfo.degree} • {docinfo.speciality}
                <span className="ml-3 text-xs border border-slate-300 px-3 py-1 rounded-full bg-slate-50">
                  {docinfo.experience}
                </span>
              </p>

              <div className="mt-6">
                <p className="font-semibold flex items-center gap-2 text-slate-800">
                  About
                  <img src={assets.info_icon} alt="" className="w-4" />
                </p>

                <p className="text-slate-600 text-sm mt-2 leading-7">
                  {docinfo.about}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-2xl">
                  <p className="text-xs uppercase tracking-wide">Consultation Fee</p>
                  <p className="text-lg font-semibold">
                    {currencysymbol}
                    {docinfo.fees}
                  </p>
                </div>

                <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl">
                  <p className="text-xs uppercase tracking-wide">Availability</p>
                  <p className="text-lg font-semibold">Next 7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-12 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-2xl font-bold text-slate-800">Book Appointment</p>
                <p className="text-slate-500 text-sm mt-1">
                  Select a day and choose an available time slot
                </p>
              </div>

              {selectedDayLabel && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-700">
                  Selected Day: <span className="font-semibold">{selectedDayLabel}</span>
                </div>
              )}
            </div>

            {/* Days */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {docslots.length > 0 &&
                docslots.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setslotindex(index);
                      setslottime("");
                    }}
                    className={`min-w-[82px] h-24 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 ${
                      slotindex === index
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <p className="text-xs font-medium">
                      {daysofweek[item[0].datetime.getDay()]}
                    </p>
                    <p className="text-xl font-bold mt-1">
                      {item[0].datetime.getDate()}
                    </p>
                  </button>
                ))}
            </div>

            {/* Time Slots */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-slate-700 mb-4">
                Available Time Slots
              </p>

              <div className="flex flex-wrap gap-3">
                {docslots.length > 0 &&
                  docslots[slotindex]?.map((item, index) => (
                    <button
                      key={index}
                      disabled={item.booked}
                      onClick={() => !item.booked && setslottime(item.time)}
                      className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                        item.booked
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                          : slottime === item.time
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
                    >
                      {item.time} {item.booked ? "• Booked" : ""}
                    </button>
                  ))}
              </div>

              {docslots.length > 0 &&
                docslots[slotindex]?.every((slot) => slot.booked) && (
                  <p className="text-red-500 text-sm mt-4">
                    All slots for this day are booked. Please choose another day.
                  </p>
                )}
            </div>

            {/* Button */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={bookAppointment}
                disabled={booking}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-10 py-3.5 rounded-2xl shadow-md transition-all duration-300 font-semibold"
              >
                {booking ? "Booking..." : "Book an Appointment"}
              </button>

              <button
                onClick={() => navigate("/my-appointments")}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-10 py-3.5 rounded-2xl transition-all duration-300 font-semibold"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>

        <RelatedDoctor docId={docId} speciality={docinfo.speciality} />
      </div>
    )
  );
}