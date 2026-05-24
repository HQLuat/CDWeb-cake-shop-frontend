import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthPage, HomePage, ProductListPage } from "../pages/public";
import { Dashboard } from "../pages/admin";
import { CartPage, Profile } from "../pages/user";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../layouts/publicLayout";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import AdminProductManagement from "../pages/admin/AdminProduct";
import AdminOrderManagement from "../pages/admin/AdminOrder";
import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";
import ProductDetailPage from "../pages/public/ProductDetailPage";

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
        element: <HomePage />,
      },
      {
        path: "/product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/products",
        element: <ProductListPage />,
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
      // ADMIN
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/analytics" replace />,
          },
          {
            path: "analytics",
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <AdminProductManagement />,
          },
          {
            path: "orders",
            element: <AdminOrderManagement />,
          },
        ],
      },

      // USER
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/cart",
            element: <CartPage />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },

  {
    path: "/dashboard",
    element: <Navigate to="/admin/analytics" replace />,
  },

  // --- ERROR/404 ---
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
