import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">✈ TravelBook</Link>
      <div className="nav-links">
        <Link to="/">Tours</Link>
        {user && <Link to="/bookings">My Bookings</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
