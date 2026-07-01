import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import TourCard from "../components/TourCard";

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destination, setDestination] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  async function fetchTours(filters = {}) {
    setLoading(true);
    try {
      const { data } = await api.get("/tours", { params: filters });
      setTours(data);
    } catch (err) {
      setError("Failed to load tours. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTours();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const filters = {};
    if (destination) filters.destination = destination;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    fetchTours(filters);
  }

  return (
    <div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Destination (e.g. Goa)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading tours...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && tours.length === 0 && <p>No tours match your search.</p>}

      <div className="tour-grid">
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
