import crypto from "crypto";

const JOIN_EARLY_MINUTES = 10;
const JOIN_AFTER_MINUTES = 45;

export const createVideoMeeting = () => {
  const meetingRoom = `doctor-management-${crypto.randomBytes(12).toString("hex")}`;

  return {
    meetingRoom,
    meetingUrl: meetingRoom,
  };
};

const parseAppointmentDateTime = (slotDate = "", slotTime = "") => {
  const [day, month, year] = slotDate.split("_").map(Number);
  const match = String(slotTime).match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i);

  if (!day || !month || !year || !match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

export const getVideoJoinStatus = (appointment) => {
  if (appointment.consultationType !== "video") {
    return {
      allowed: false,
      reason: "",
    };
  }

  if (appointment.status === "cancelled") {
    return {
      allowed: false,
      reason: "Video call cancelled",
    };
  }

  if (appointment.status === "completed") {
    return {
      allowed: false,
      reason: "Video call completed",
    };
  }

  if (!appointment.payment) {
    return {
      allowed: false,
      reason: "Payment required before joining video call",
    };
  }

  if (!appointment.meetingUrl) {
    return {
      allowed: false,
      reason: "Video link is being prepared",
    };
  }

  const appointmentTime = parseAppointmentDateTime(
    appointment.slotDate,
    appointment.slotTime
  );

  if (!appointmentTime) {
    return {
      allowed: false,
      reason: "Appointment time is invalid",
    };
  }

  const now = new Date();
  const opensAt = new Date(
    appointmentTime.getTime() - JOIN_EARLY_MINUTES * 60 * 1000
  );
  const closesAt = new Date(
    appointmentTime.getTime() + JOIN_AFTER_MINUTES * 60 * 1000
  );

  if (now < opensAt) {
    return {
      allowed: false,
      reason: `Video call opens ${JOIN_EARLY_MINUTES} minutes before appointment`,
      opensAt,
      closesAt,
    };
  }

  if (now > closesAt) {
    return {
      allowed: false,
      reason: "Video call window has ended",
      opensAt,
      closesAt,
    };
  }

  return {
    allowed: true,
    reason: "",
    opensAt,
    closesAt,
  };
};

export const ensurePaidVideoMeeting = async (appointment, appointmentModel) => {
  const item = appointment.toObject();

  if (item.consultationType !== "video") {
    return item;
  }

  if (!item.payment) {
    item.meetingUrl = "";
    item.meetingRoom = "";
    return {
      ...item,
      videoJoin: getVideoJoinStatus(item),
    };
  }

  if (item.meetingUrl && item.meetingRoom) {
    return {
      ...item,
      videoJoin: getVideoJoinStatus(item),
    };
  }

  const meeting = createVideoMeeting();

  await appointmentModel.findByIdAndUpdate(item._id, meeting);

  return {
    ...item,
    ...meeting,
    videoJoin: getVideoJoinStatus({
      ...item,
      ...meeting,
    }),
  };
};
