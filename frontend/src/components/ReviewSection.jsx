import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

function StarRating({ value, onChange, readonly }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? "filled" : ""} ${readonly ? "" : "clickable"}`}
          onClick={() => !readonly && onChange && onChange(star)}
        >★</span>
      ))}
    </div>
  );
}

export default function ReviewSection({ tourId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function fetchReviews() {
    const { data } = await api.get(`/reviews/${tourId}`);
    setReviews(data.reviews);
    setAvgRating(data.avgRating);
  }

  useEffect(() => { fetchReviews(); }, [tourId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (rating === 0) { setError("Please select a rating"); return; }
    try {
      await api.post("/reviews", { tourId, rating, comment });
      setSubmitted(true);
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    }
  }

  return (
    <div className="review-section">
      <div className="review-header">
        <h3>Reviews</h3>
        {avgRating && (
          <div className="avg-rating">
            <StarRating value={Math.round(avgRating)} readonly />
            <span>{avgRating} / 5 ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      {user && !submitted && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h4>Leave a Review</h4>
          {error && <p className="error">{error}</p>}
          <StarRating value={rating} onChange={setRating} />
          <textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} required maxLength={500} />
          <button type="submit">Submit Review</button>
        </form>
      )}
      {submitted && <p className="success">Thanks for your review!</p>}

      <div className="reviews-list">
        {reviews.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
        {reviews.map((r) => (
          <div key={r._id} className="review-card">
            <div className="review-top">
              <div className="reviewer-avatar">{r.user?.name?.charAt(0).toUpperCase()}</div>
              <div><strong>{r.user?.name}</strong><StarRating value={r.rating} readonly /></div>
              <span className="review-date">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <p>{r.comment}</p>

cat > ~/Desktop/"travel-booking 2"/frontend/src/pages/Profile.jsx << 'EOF'
import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", profilePhoto: "", currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/users/profile");
        setForm((f) => ({ ...f, name: data.name, email: data.email, profilePhoto: data.profilePhoto || "" }));
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      await api.put("/users/profile", form);
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: form.name, email: form.email }));
      setMessage("Profile updated successfully!");
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {form.profilePhoto
            ? <img src={form.profilePhoto} alt="Profile" />
            : <div className="avatar-placeholder">{form.name?.charAt(0).toUpperCase()}</div>
          }
        </div>
        <div><h2>{form.name}</h2><p>{form.email}</p></div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <h3>Edit Profile</h3>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <label>Full Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label>Profile Photo URL<input placeholder="https://example.com/photo.jpg" value={form.profilePhoto} onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })} /></label>
        <hr />
        <p className="section-label">Change Password (optional)</p>
        <label>Current Password<input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} /></label>
        <label>New Password<input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} /></label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
