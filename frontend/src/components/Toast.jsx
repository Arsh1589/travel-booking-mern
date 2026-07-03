import { useNotifications } from "../context/NotificationContext";

export default function Toast() {
  const { toast } = useNotifications();
  if (!toast) return null;
  return (
    <div className="toast">
      <span className="toast-icon">🎉</span>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
    </div>
  );
}
