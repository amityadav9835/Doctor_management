import notificationModel from "../models/notificationModel.js";
import { sendTomorrowAppointmentReminders } from "../services/notificationService.js";

export const listNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);
    const unreadCount = await notificationModel.countDocuments({
      userId,
      read: false,
    });

    return res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.json({ success: false, message: "Notification id is required" });
    }

    await notificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true, readAt: new Date() }
    );

    return res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await notificationModel.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );

    return res.json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendAppointmentReminders = async (req, res) => {
  try {
    const userId = req.userId;
    const reminders = await sendTomorrowAppointmentReminders(userId);

    return res.json({
      success: true,
      message: `${reminders.length} reminder notification(s) created`,
      reminders,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.json({ success: false, message: "Notification id is required" });
    }

    const deletedNotification = await notificationModel.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    if (!deletedNotification) {
      return res.json({ success: false, message: "Notification not found" });
    }

    return res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await notificationModel.deleteMany({ userId });

    return res.json({
      success: true,
      message: `${result.deletedCount} notification(s) deleted`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
