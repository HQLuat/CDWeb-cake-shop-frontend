import { useState, type FormEvent } from "react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom"; 

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 z-[100] shadow-sm bg-bg-main">
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
          <ul className="flex gap-8 text-[13px] font-medium uppercase tracking-[1px] text-text-dark transition-colors duration-300">
            <li className="text-primary relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-primary">
              <Link to="/home">home</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link to="/about">about</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link to="/order">order</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link to="/products">menu</Link>
            </li>
          </ul>
        </nav>

        {/* CỘT PHẢI: Search + Cart + Sign in (Gom thành 1 cụm) */}
        <div className="flex-1 flex items-center justify-end gap-5">
          
          {/* Thanh tìm kiếm */}
          <form 
            onSubmit={handleSearch} 
            className="relative hidden md:flex items-center group"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#f4f4f4] border-none py-2 px-4 pr-10 rounded-full text-[13px] outline-none w-[130px] focus:w-[180px] transition-all duration-300"
            />
            <button type="submit" className="absolute right-3 text-gray-400 group-focus-within:text-primary">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>

          {/* Cart Icon */}
          <Link to="/cart" className="text-primary hover:scale-110 transition-transform">
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