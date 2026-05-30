// import { Navigate, Outlet } from "react-router-dom";

// function ProtectedRoute() {
//   const isAuthenticated = !!localStorage.getItem("token");

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }

// export default ProtectedRoute;
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // BÌNH THƯỜNG: const isAuthenticated = !!localStorage.getItem("token");
  
  // SỬA THÀNH: Luôn luôn trả về true để bypass qua màn hình đăng nhập khi code giao diện
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;