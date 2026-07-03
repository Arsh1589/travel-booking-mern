import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleOpen() { setOpen((prev) => !prev); if (unreadCount > 0) markAllRead(); }

  function handleNotificationClick(link) { setOpen(false); navigate(link); }

  return (
    <div className="notification-bell" ref={ref}>
      <button className="bell-btn" onClick={handleOpen}>
        🔔
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header"><h4>Notifications</h4></div>
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications yet</p>
          ) : (
            notifications.slice(0, 8).map((n) => (
              <div key={n._id} className={`notification-item ${!n.read ? "unread" : ""}`} onClick={() => handleNotificationClick(n.link)}>
                <div className="notification-icon">{n.type === "booking_confirmed" ? "🎉" : "📢"}</div>
                <div className="notification-text">
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <span>{new Date(n.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
