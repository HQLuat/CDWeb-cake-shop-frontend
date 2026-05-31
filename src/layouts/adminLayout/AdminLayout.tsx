import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faBox, faClipboardList, faSignOutAlt, faUsers, faTag, faHome } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

function AdminLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin/analytics", label: "Thống kê", icon: faChartBar },
    { path: "/admin/products", label: "Quản lý sản phẩm", icon: faBox },
    { path: "/admin/orders", label: "Quản lý đơn hàng", icon: faClipboardList },
    { path: "/admin/users", label: "Quản lý người dùng", icon: faUsers },
    { path: "/admin/promotions", label: "Quản lý khuyến mãi", icon: faTag },
  ];

  const handleLogout = () => {
    dispatch(logout()); // clears token + role from localStorage & Redux
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
        <div>
          <div className="mb-8 px-2">
            <h2 className="font-lora text-xl font-bold text-primary tracking-wide">
              Velvet Muse Admin
            </h2>
            <p className="text-xs text-gray-400 mt-1">Hệ thống quản trị tiệm bánh</p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === item.path
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 text-center" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-3.5 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl text-sm font-semibold transition-all"
          >
            <FontAwesomeIcon icon={faHome} className="w-5" />
            Trang chủ
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;