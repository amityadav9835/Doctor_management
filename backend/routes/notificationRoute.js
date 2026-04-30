import express from "express";
import {
  deleteAllNotifications,
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  sendAppointmentReminders,
} from "../controllers/notificationController.js";
import authUser from "../middlewares/authUser.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authUser, listNotifications);
notificationRouter.post("/mark-read", authUser, markNotificationRead);
notificationRouter.post("/mark-all-read", authUser, markAllNotificationsRead);
notificationRouter.post("/send-reminders", authUser, sendAppointmentReminders);
notificationRouter.post("/delete", authUser, deleteNotification);
notificationRouter.delete("/", authUser, deleteAllNotifications);

export default notificationRouter;
