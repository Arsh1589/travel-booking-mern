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
