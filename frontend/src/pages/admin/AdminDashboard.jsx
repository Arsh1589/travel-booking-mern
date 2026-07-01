import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

const emptyForm = {
  title: "",
  destination: "",
  description: "",
  price: "",
  durationDays: "",
  totalSlots: "",
};

export default function AdminDashboard() {
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadData() {
    const [toursRes, bookingsRes] = await Promise.all([
      api.get("/tours"),
      api.get("/bookings"),
    ]);
    setTours(toursRes.data);
    setBookings(bookingsRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        totalSlots: Number(form.totalSlots),
        itinerary: [],
      };

      if (editingId) {
        await api.put(`/tours/${editingId}`, payload);
      } else {
        await api.post("/tours", payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save tour");
    }
  }

  function startEdit(tour) {
    setEditingId(tour._id);
    setForm({
      title: tour.title,
      destination: tour.destination,
      description: tour.description,
      price: tour.price,
      durationDays: tour.durationDays,
      totalSlots: tour.totalSlots,
    });
  }

  async function handleDelete(tourId) {
    if (!confirm("Delete this tour?")) return;
    await api.delete(`/tours/${tourId}`);
    loadData();
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>{editingId ? "Edit Tour" : "Add New Tour"}</h3>
        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="durationDays" type="number" placeholder="Duration (days)" value={form.durationDays} onChange={handleChange} required />
          <input name="totalSlots" type="number" placeholder="Total slots" value={form.totalSlots} onChange={handleChange} required />
          <button type="submit">{editingId ? "Update Tour" : "Create Tour"}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <h3>All Tours ({tours.length})</h3>
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Destination</th><th>Price</th><th>Slots</th><th></th></tr>
          </thead>
          <tbody>
            {tours.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.destination}</td>
                <td>₹{t.price}</td>
                <td>{t.bookedSlots}/{t.totalSlots}</td>
                <td>
                  <button onClick={() => startEdit(t)}>Edit</button>
                  <button onClick={() => handleDelete(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>All Bookings ({bookings.length})</h3>
        <table className="admin-table">
          <thead>
            <tr><th>User</th><th>Tour</th><th>Date</th><th>Travelers</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.user?.name} ({b.user?.email})</td>
                <td>{b.tour?.title}</td>
                <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                <td>{b.numberOfTravelers}</td>
                <td>₹{b.totalPrice}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
