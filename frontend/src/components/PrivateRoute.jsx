import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps protected pages. Redirects unauthenticated users to /login.
// Note: this only controls the UI — the real security check happens
// in the backend's auth middleware, since a user could call the API
// directly and bypass this entirely.
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
