import { Navigate, Outlet } from "react-router-dom";

/**
 * AdminRoute – only allows users with role === "ADMIN".
 * - No token  → redirect to /login
 * - Non-admin → redirect to /home
 * Uses localStorage so the guard survives page refresh without Redux hydration.
 */
function AdminRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;

  return <Outlet />;
}

export default AdminRoute;
