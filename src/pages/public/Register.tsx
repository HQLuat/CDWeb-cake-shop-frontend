import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { artisanBakeryInterior } from "../../assets/login/index";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <div className="mx-auto h-screen w-300 bg-[#fff8f3] font-sans antialiased text-[#5b403c] overflow-hidden flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 lg:p-10 gap-6 lg:gap-10 overflow-hidden">
        {/* Left Side: Brand Visual Section */}
        <div className="hidden lg:flex flex-1 max-w-[45%] h-full">
          <div className="relative w-full h-full bg-[#6F0001] rounded-[40px] overflow-hidden flex flex-col justify-center shadow-2xl">
            {/* Background Image */}
            <img
              className="absolute inset-0 w-full h-full opacity-90 object-cover pointer-events-none"
              src={artisanBakeryInterior}
              alt="Bakery Interior"
            />

            {/* Brand Content */}
            <div className="relative z-10 p-12 flex flex-col gap-4">
              <h1 className="text-[#fff8f3] text-5xl xl:text-6xl font-serif italic leading-tight">
                Velvet Crumb
              </h1>
              <p className="text-[#fbf2ea] text-lg font-serif italic opacity-90 max-w-sm">
                Where every bite tells a story of tradition, butter, and
                artistry.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <div className="w-16 h-0.5 bg-[#eae1d9]" />
                <span className="text-[#eae1d9] text-[10px] font-bold uppercase tracking-[2.4px]">
                  THE EDITORIAL ISSUE Nº 01
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center h-full relative">
          <div className="w-full max-w-95 flex flex-col gap-6 z-10">
            {/* Title */}
            <div>
              <h2 className="text-[#6f0001] text-3xl font-serif">
                Join the Luna Artisan
              </h2>
              <p className="text-sm opacity-70">
                Unlock artisanal rewards and collections.
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3.5">
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Agott"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#6f0001]/20 transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="agott@xuongphepthuat.com"
                  className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#6f0001]/20 transition-all"
                />
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#6f0001]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 ml-1">
                    Confirm
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#6f0001]/20 transition-all"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-3.5 h-3.5 accent-[#6f0001]  cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-[11px] leading-4 opacity-80 cursor-pointer"
                >
                  I agree to the{" "}
                  <span className="text-[#6f0001] font-bold">
                    Terms of Service
                  </span>{" "}
                  and wish to receive the weekly bakery editorial newsletter.
                </label>
              </div>

              {/* Submit Button */}
              <button className="w-full py-4 mt-2 bg-[#9a0002] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-[#8a0001] transition-all active:scale-[0.98] cursor-pointer">
                Create Account
              </button>
            </div>

            {/* Link to Sign In */}
            <p className="text-center text-xs opacity-60">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#6f0001] font-bold hover:underline cursor-pointer"
              >
                Sign In
              </Link>
            </p>

            {/* Social Logins */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#6f0001]/10"></div>
                <span className="text-[10px] uppercase opacity-30">
                  Or join with
                </span>
                <div className="flex-1 h-px bg-[#6f0001]/10"></div>
              </div>
              <div className="flex justify-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fbf2ea] text-[#5b403c] hover:bg-[#6f0001] hover:text-white transition-all shadow-sm cursor-pointer">
                  <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fbf2ea] text-[#5b403c] hover:bg-[#6f0001] hover:text-white transition-all shadow-sm cursor-pointer">
                  <FontAwesomeIcon icon={faFacebookF} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#fbf2ea] text-[#5b403c] hover:bg-[#6f0001] hover:text-white transition-all shadow-sm cursor-pointer">
                  <FontAwesomeIcon icon={faInstagram} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
