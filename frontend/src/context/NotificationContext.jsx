import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../api/axiosClient";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) { setNotifications([]); setUnreadCount(0); return; }
    async function loadNotifications() {
      try {
        const { data } = await api.get("/notifications");
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (err) { console.error("Failed to load notifications:", err); }
    }
    loadNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001", { transports: ["websocket", "polling"] });
    socket.on("connect", () => { socket.emit("join", user.id); });
    socket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setToast(notification);
      setTimeout(() => setToast(null), 4000);
    });
    return () => socket.disconnect();
  }, [user]);

  async function markAllRead() {
    try {
      await api.put("/notifications/read-all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) { console.error("Failed to mark notifications as read:", err); }
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, toast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() { return useContext(NotificationContext); }
