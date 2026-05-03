import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="w-full fixed top-0 left-0 z-100">
      <div className="h-20 p-5 flex justify-between items-center bg-bg-main">
        <Link
          to="/home"
          className="font-lora text-[24px] font-semibold text-primary"
        >
          Luna Artisan
        </Link>
        <nav>
          <ul className="flex gap-7.5 text-[13px] font-medium uppercase tracking-[1px] text-text-dark transition-colors duration-300">
            <li className="text-primary relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-[2.5px] after:bg-primary">
              <Link to="/home">home</Link>
            </li>
            <li>
              <Link to="/about">about</Link>
            </li>
            <li>
              <Link to="/order">order</Link>
            </li>
            <li>
              <Link to="/blog">blog</Link>
            </li>
          </ul>
        </nav>
        <div>
          <FontAwesomeIcon
            icon={faCartShopping}
            className="mr-4 text-primary"
          />
          <Link
            to="/login"
            className="bg-primary text-white px-6 py-3 rounded-[30px] text-[13px] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
