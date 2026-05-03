import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthPage, Home } from "../pages/public";
import { Dashboard } from "../pages/admin";
import { Profile } from "../pages/user";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../layouts/publicLayout";
import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";

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
    element: <AuthPage />,
    children: [
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
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
