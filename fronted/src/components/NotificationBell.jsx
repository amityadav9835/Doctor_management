import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bell,
  CheckCheck,
  Clock,
  Mail,
  MessageSquareText,
  Trash2,
  X,
} from "lucide-react";
import { Appcontext } from "../context/Appccontext";

const getTypeClasses = (type) => {
  switch (type) {
    case "reminder":
      return "bg-amber-50 text-amber-700";
    case "payment":
      return "bg-emerald-50 text-emerald-700";
    case "appointment":
      return "bg-indigo-50 text-indigo-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function NotificationBell() {
  const { backendUrl, token } = useContext(Appcontext);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const authConfig = useMemo(() => ({ headers: { token } }), [token]);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/notifications`,
        authConfig
      );

      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/notifications/mark-all-read`,
        {},
        authConfig
      );
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark notifications read error:", error);
    }
  };

  const sendReminderCheck = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/notifications/send-reminders`,
        {},
        authConfig
      );

      if (data.success) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Send reminders error:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const deletedItem = notifications.find((item) => item._id === notificationId);

      await axios.post(
        `${backendUrl}/api/notifications/delete`,
        { notificationId },
        authConfig
      );

      setNotifications((prev) =>
        prev.filter((item) => item._id !== notificationId)
      );

      if (deletedItem && !deletedItem.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await axios.delete(`${backendUrl}/api/notifications`, authConfig);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Delete all notifications error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    window.addEventListener("notifications:refresh", fetchNotifications);

    return () => {
      window.removeEventListener("notifications:refresh", fetchNotifications);
    };
  }, [token, backendUrl]);

  if (!token) return null;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) fetchNotifications();
        }}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[80] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">
                Appointment updates, reminders, email and SMS status
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <CheckCheck className="h-4 w-4" />
              Mark read
            </button>
            <button
              onClick={sendReminderCheck}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <Clock className="h-4 w-4" />
              Check tomorrow
            </button>
            {notifications.length > 0 && (
              <button
                onClick={deleteAllNotifications}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-5 text-sm text-slate-500">Loading...</div>
            ) : notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`border-b border-slate-100 px-4 py-3 ${
                    item.read ? "bg-white" : "bg-indigo-50/40"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeClasses(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteNotification(item._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.message}
                  </p>
                  <div className="mt-2 flex gap-2 text-xs text-slate-500">
                    {item.channels?.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </span>
                    )}
                    {item.channels?.sms && (
                      <span className="inline-flex items-center gap-1">
                        <MessageSquareText className="h-3 w-3" />
                        SMS
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No notifications yet. Booking, payment, cancellation, and
                reminder messages will appear here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
