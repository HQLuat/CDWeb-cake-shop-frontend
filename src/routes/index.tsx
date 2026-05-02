import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login, Home } from "../pages/public";
import { Dashboard } from "../pages/admin";
import { Profile } from "../pages/user";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../layouts/publicLayout";
import AuthLayout from "../layouts/authLayout";

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },

  // --- PRIVATE ROUTES ---
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },

  // --- ERROR/404 ---
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
