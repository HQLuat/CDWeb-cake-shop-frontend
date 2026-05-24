import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";

function Header() {
  // Nav bar
  const navItems = [
    { name: "home", path: "/home" },
    { name: "about", path: "/about" },
    { name: "order", path: "/order" },
    { name: "menu", path: "/products" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-100 shadow-sm bg-bg-main">
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

        {/* CỘT PHẢI: Search + Cart + Sign in (Gom thành 1 cụm) */}
        <div className="flex-1 flex items-center justify-end gap-5">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="text-primary hover:scale-110 transition-transform"
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-lg cursor-pointer"
            />
          </Link>

          {/* Sign in Button */}
          <Link
            to="/login"
            className="bg-primary text-white px-5 py-2.5 rounded-[30px] text-[12px] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-300 hover:bg-opacity-90 whitespace-nowrap"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
