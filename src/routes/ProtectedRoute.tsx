// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const isAuthenticated = !!localStorage.getItem("token");

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Giả sử logic cũ của bạn dạng như: 
  // const { isAuthenticated } = useAuth();
  
  // CHỈNH SỬA: Comment logic cũ hoặc bỏ qua, cho phép đi thẳng luôn
  const isTestingGiaoDien = true; 

  if (!isTestingGiaoDien) {
    return <Navigate to="/login" replace />;
  }

  // Luôn cho phép hiển thị nội dung các trang bên trong (bao gồm Admin)
  return <Outlet />;
}

export default ProtectedRoute;