import nodemailer from "nodemailer";
import twilio from "twilio";
import appointmentModel from "../models/appointmentModel.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/user.js";

const cleanEnv = (value = "") => value.trim().replace(/^['"]|['"]$/g, "").trim();

const getMailTransporter = () => {
  const host = cleanEnv(process.env.SMTP_HOST);
  const port = Number(cleanEnv(process.env.SMTP_PORT) || 587);
  const user = cleanEnv(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASS);

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const getTwilioClient = () => {
  const accountSid = cleanEnv(process.env.TWILIO_ACCOUNT_SID);
  const authToken = cleanEnv(process.env.TWILIO_AUTH_TOKEN);

  if (!accountSid || !authToken) return null;

  return twilio(accountSid, authToken);
};

export const formatAppointmentDate = (slotDate = "") => {
  const [day, month, year] = slotDate.split("_").map(Number);

  if (!day || !month || !year) return slotDate;

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getAppointmentDateOnly = (slotDate = "") => {
  const [day, month, year] = slotDate.split("_").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
};

export const getAppointmentMessage = (appointment, prefix = "Your appointment") => {
  const doctorName = appointment.docData?.name || "your doctor";
  const date = formatAppointmentDate(appointment.slotDate);

  return `${prefix} with ${doctorName} is scheduled for ${date} at ${appointment.slotTime}.`;
};

export const sendEmailNotification = async ({ to, subject, text }) => {
  const transporter = getMailTransporter();
  const from = cleanEnv(process.env.NOTIFICATION_EMAIL_FROM || process.env.SMTP_USER);

  if (!transporter || !to || !from) {
    return { sent: false, skipped: true, reason: "Email is not configured" };
  }

  await transporter.sendMail({ from, to, subject, text });
  return { sent: true };
};

export const sendSmsNotification = async ({ to, body }) => {
  const client = getTwilioClient();
  const from = cleanEnv(process.env.TWILIO_PHONE_NUMBER);

  if (!client || !from || !to || to === "0000000000") {
    return { sent: false, skipped: true, reason: "SMS is not configured" };
  }

  await client.messages.create({ from, to, body });
  return { sent: true };
};

export const createNotification = async ({
  userId,
  appointmentId,
  title,
  message,
  type = "system",
  sendEmail = false,
  sendSms = false,
}) => {
  const user = await userModel.findById(userId).select("-password");

  const notification = await notificationModel.create({
    userId,
    appointmentId,
    title,
    message,
    type,
    channels: {
      inApp: true,
      email: sendEmail,
      sms: sendSms,
    },
  });

  if (user && sendEmail) {
    sendEmailNotification({
      to: user.email,
      subject: title,
      text: message,
    }).catch((error) => console.log("Email notification error:", error.message));
  }

  if (user && sendSms) {
    sendSmsNotification({
      to: user.phone,
      body: message,
    }).catch((error) => console.log("SMS notification error:", error.message));
  }

  return notification;
};

export const notifyAppointmentBooked = async (appointment) =>
  createNotification({
    userId: appointment.userId,
    appointmentId: appointment._id,
    title: "Appointment booked",
    message: getAppointmentMessage(appointment, "Your appointment"),
    type: "appointment",
    sendEmail: true,
    sendSms: true,
  });

export const notifyAppointmentCancelled = async (appointment) =>
  createNotification({
    userId: appointment.userId,
    appointmentId: appointment._id,
    title: "Appointment cancelled",
    message: getAppointmentMessage(appointment, "Your cancelled appointment"),
    type: "appointment",
    sendEmail: true,
    sendSms: false,
  });

export const notifyPaymentConfirmed = async (appointment) =>
  createNotification({
    userId: appointment.userId,
    appointmentId: appointment._id,
    title: "Payment confirmed",
    message: `Payment received. ${getAppointmentMessage(appointment)}`,
    type: "payment",
    sendEmail: true,
    sendSms: false,
  });

export const sendTomorrowAppointmentReminders = async (userId) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const appointments = await appointmentModel.find({
    userId,
    status: { $ne: "cancelled" },
  });

  const tomorrowAppointments = appointments.filter((appointment) => {
    const appointmentDate = getAppointmentDateOnly(appointment.slotDate);
    if (!appointmentDate) return false;

    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === tomorrow.getTime();
  });

  const reminders = await Promise.all(
    tomorrowAppointments.map(async (appointment) => {
      const existingReminder = await notificationModel.findOne({
        userId: appointment.userId,
        appointmentId: appointment._id,
        type: "reminder",
        title: "Appointment reminder",
      });

      if (existingReminder) return existingReminder;

      return createNotification({
        userId: appointment.userId,
        appointmentId: appointment._id,
        title: "Appointment reminder",
        message: getAppointmentMessage(appointment, "Your appointment is tomorrow"),
        type: "reminder",
        sendEmail: true,
        sendSms: true,
      });
    })
  );

  return reminders;
};
