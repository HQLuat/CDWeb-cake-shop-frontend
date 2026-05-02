import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="bg-secondary">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
