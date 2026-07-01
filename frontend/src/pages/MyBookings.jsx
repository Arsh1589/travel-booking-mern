import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    try {
      const { data } = await api.get(`/bookings/user/${user.id}`);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBookings(); }, [user]);

  async function handleCancel(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet. <a href="/">Explore tours →</a></p>}
      <div className="bookings-grid">
        {bookings.map((b) => (
          <div key={b._id} className="booking-card">
            {b.tour?.images?.[0] && <img src={b.tour.images[0]} alt={b.tour.title} className="booking-img" />}
            <div className="booking-info">
              <h3>{b.tour?.title}</h3>
              <p>📍 {b.tour?.destination}</p>
              <p>🗓 {new Date(b.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              <p>👥 {b.numberOfTravelers} traveler{b.numberOfTravelers > 1 ? "s" : ""}</p>
              <p>💰 ₹{b.totalPrice?.toLocaleString()}</p>
              <div className="booking-footer">
                <span className={`status status-${b.status}`}>{b.status.replace("_", " ")}</span>
                {b.status === "confirmed" && (
                  <button className="cancel-btn" onClick={() => handleCancel(b._id)}>Cancel</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
