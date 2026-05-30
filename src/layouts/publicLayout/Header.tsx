import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faBoxOpen,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { ShoppingCart, User } from "lucide-react";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!user || !!localStorage.getItem("token");

  // Xác định xem có phải trang chủ không
  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login");
  };

  const navItems = [
    { name: "trang chủ", path: "/home" },
    { name: "Về chúng tôi", path: "/about" },
    { name: "đơn hàng", path: "/orders" },
    { name: "sản phẩm", path: "/products" },
  ];

  return (
    <header
      className={`w-full fixed top-0 left-0 z-100 bg-bg-main transition-shadow duration-300 
        ${isHomePage ? "" : "shadow-sm"}`}
    >
      <div className="h-20 px-6 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          <Link
            to="/home"
            className="font-lora text-[24px] font-bold text-primary whitespace-nowrap"
          >
            Velvet Muse
          </Link>
        </div>

        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex gap-8 text-[13px] font-medium uppercase tracking-[1px] text-text-dark">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "transition-colors duration-300 hover:text-primary text-primary relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-primary"
                      : "transition-colors duration-300 hover:text-primary"
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-5">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="text-primary hover:scale-110 transition-transform"
          >
            <ShoppingCart fill="currentColor" stroke="currentColor" />
          </Link>

          {!isAuthenticated ? (
            /* Chưa đăng nhập */
            <Link
              to="/login"
              className="bg-primary text-white px-5 py-2.5 rounded-[30px] text-[12px] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-300 hover:bg-opacity-90 whitespace-nowrap"
            >
              Sign in
            </Link>
          ) : (
            /* Đã đăng nhập — User dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-[30px] transition-all duration-300 cursor-pointer"
              >
                <User fill="currentColor" className="text-primary" />
                <span className="text-[12px] font-semibold max-w-20 truncate">
                  Tài khoản
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-[10px] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                  {/* User info */}
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="w-4 text-gray-400"
                    />
                    Trang cá nhân
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className="w-4 text-gray-400"
                    />
                    Giỏ hàng
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faBoxOpen}
                      className="w-4 text-gray-400"
                    />
                    Đơn hàng của tôi
                  </Link>

                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
