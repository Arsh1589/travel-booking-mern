import { Link } from "react-router-dom";

const difficultyMap = {
  easy: { label: "Easy", color: "#27ae60" },
  moderate: { label: "Moderate", color: "#f39c12" },
  challenging: { label: "Challenging", color: "#e74c3c" },
};

function getDifficulty(durationDays) {
  if (durationDays <= 3) return "easy";
  if (durationDays <= 5) return "moderate";
  return "challenging";
}

export default function TourCard({ tour }) {
  const difficulty = getDifficulty(tour.durationDays);
  const { label, color } = difficultyMap[difficulty];
  const availableSlots = tour.totalSlots - tour.bookedSlots;
  const soldOut = availableSlots <= 0;
  const descPreview = tour.description?.length > 80 ? tour.description.slice(0, 80) + "..." : tour.description;

  return (
    <div className={`tour-card ${soldOut ? "sold-out-card" : ""}`}>
      <div className="tour-card-img-wrapper">
        <img src={tour.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"} alt={tour.title} />
        <span className="difficulty-badge" style={{ background: color }}>{label}</span>
        {soldOut
          ? <span className="sold-out-badge">Sold Out</span>
          : availableSlots <= 5
          ? <span className="slots-badge">Only {availableSlots} left!</span>
          : null
        }
      </div>
      <div className="tour-card-body">
        <div className="tour-card-meta">
          <span>📍 {tour.destination}</span>
          <span>🗓 {tour.durationDays} days</span>
        </div>
        <h3>{tour.title}</h3>
        <p className="tour-desc">{descPreview}</p>
        <div className="tour-card-footer">
          <span className="price">{soldOut ? "Fully Booked" : `₹${tour.price.toLocaleString()}`}</span>
          <Link to={`/tours/${tour._id}`} className={`view-btn ${soldOut ? "view-btn-disabled" : ""}`}>
            {soldOut ? "View →" : "View Details →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
