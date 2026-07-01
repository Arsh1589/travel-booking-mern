import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const highlights = {
  Goa: ["🏖 Private beach access", "🤿 Snorkelling gear included", "🍹 Welcome drink on arrival", "🚤 Boat cruise"],
  Manali: ["🏔 Rohtang Pass excursion", "🎿 Snow activities", "🏕 Bonfire nights", "🚵 Adventure sports"],
  Kerala: ["🛶 Private houseboat", "🌴 Backwater cruise", "🐦 Bird sanctuary visit", "🍛 Traditional meals"],
  Rajasthan: ["🏰 Fort & palace tours", "🐪 Desert camel safari", "🌅 Desert camp night", "👑 Royal dining experience"],
  Andaman: ["🤿 Scuba diving session", "🐠 Coral reef snorkelling", "🏝 Private beach time", "🌊 Sea walk experience"],
};

function getHighlights(destination) {
  return highlights[destination] || ["✅ Expert guided tours", "🏨 Handpicked accommodation", "🚌 All transfers included", "📸 Memorable experiences"];
}

export default function TourDetails() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTour() {
      const { data } = await api.get(`/tours/${id}`);
      setTour(data);
    }
    fetchTour();
  }, [id]);

  async function handleBooking(e) {
    e.preventDefault();
    setError("");
    if (!user) { navigate("/login"); return; }
    setSubmitting(true);
    try {
      const { data: order } = await api.post("/payments/create-order", {
        tourId: id,
        travelDate,
        numberOfTravelers: travelers,
      });

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Travel Booking",
        description: tour.title,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: order.bookingId,
            });
            navigate("/bookings");
          } catch {
            setError("Payment verification failed. Contact support if money was deducted.");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#1a4d8f" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!tour) return <div className="loading">Loading tour details...</div>;

  const availableSlots = tour.totalSlots - tour.bookedSlots;
  const tourHighlights = getHighlights(tour.destination);

  return (
    <div className="tour-detail-page">

      {/* Hero */}
      <div className="tour-hero" style={{ backgroundImage: `url(${tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"})` }}>
        <div className="tour-hero-overlay">
          <h1>{tour.title}</h1>
          <div className="tour-hero-meta">
            <span>📍 {tour.destination}</span>
            <span>🗓 {tour.durationDays} Days</span>
            <span>👥 {availableSlots} slots left</span>
          </div>
        </div>
      </div>

      <div className="tour-detail-body">

        {/* Left: Info */}
        <div className="tour-detail-left">

          {/* Tabs */}
          <div className="tabs">
            {["overview", "itinerary", "highlights"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="tab-content">
              <h3>About this tour</h3>
              <p>{tour.description}</p>
              <div className="tour-stats">
                <div className="stat-box">
                  <span className="stat-num">{tour.durationDays}</span>
                  <span className="stat-label">Days</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">{tour.totalSlots}</span>
                  <span className="stat-label">Total Slots</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">{availableSlots}</span>
                  <span className="stat-label">Available</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">₹{tour.price.toLocaleString()}</span>
                  <span className="stat-label">Per Person</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="tab-content">
              <h3>Day-by-day Itinerary</h3>
              <div className="itinerary-list">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="itinerary-item">
                    <div className="itinerary-day">Day {day.day}</div>
                    <div className="itinerary-info">
                      <h4>{day.title}</h4>
                      <p>{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "highlights" && (
            <div className="tab-content">
              <h3>Tour Highlights</h3>
              <div className="highlights-grid">
                {tourHighlights.map((h, i) => (
                  <div key={i} className="highlight-card">{h}</div>
                ))}
              </div>
              <div className="inclusions">
                <h4>✅ Inclusions</h4>
                <ul>
                  <li>Accommodation (twin sharing)</li>
                  <li>Daily breakfast and dinner</li>
                  <li>All transfers and sightseeing</li>
                  <li>Expert tour guide</li>
                </ul>
                <h4>❌ Exclusions</h4>
                <ul>
                  <li>Flights to/from destination</li>
                  <li>Personal expenses</li>
                  <li>Travel insurance</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking widget */}
        <div className="booking-widget">
          <div className="widget-price">
            ₹{tour.price.toLocaleString()} <span>/ person</span>
          </div>

          {availableSlots <= 5 && (
            <p className="urgency">🔥 Only {availableSlots} slots remaining!</p>
          )}

          <form onSubmit={handleBooking} className="widget-form">
            {error && <p className="error">{error}</p>}
            <label>
              Travel Date
              <input
                type="date"
                value={travelDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setTravelDate(e.target.value)}
                required
              />
            </label>
            <label>
              Number of Travelers
              <input
                type="number"
                min="1"
                max={availableSlots}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                required
              />
            </label>
            <div className="price-breakdown">
              <span>₹{tour.price.toLocaleString()} × {travelers}</span>
              <span>₹{(tour.price * travelers).toLocaleString()}</span>
            </div>
            <button type="submit" className="book-btn" disabled={submitting}>
              {submitting ? "Processing..." : "Book Now & Pay →"}
            </button>
            <p className="widget-note">🔒 Secure payment via Razorpay</p>
            <p className="widget-note">✅ Instant booking confirmation</p>
            <p className="widget-note">📧 Email confirmation sent automatically</p>
          </form>
        </div>
      </div>
    </div>
  );
}
