import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Like PrivateRoute, but additionally requires role === "admin".
// Same caveat applies: this is a UI convenience only. Real enforcement
// happens via the adminOnly middleware on the backend.
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
