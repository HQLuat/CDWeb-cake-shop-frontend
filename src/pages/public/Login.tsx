import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { artisanBakeryInterior } from "../../assets/login/index";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <div className="mx-auto h-screen w-300 font-sans antialiased text-[#5b403c] overflow-hidden flex flex-col">
      {/* Container chính: Chiếm toàn bộ không gian còn lại trừ footer */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 lg:p-12 gap-6 lg:gap-10 overflow-hidden">
        {/* Left Side: Brand Visual Section */}
        <div className="hidden lg:flex flex-1 max-w-[45%] h-full">
          <div className="relative w-full h-full bg-[#6F0001] rounded-[48px] overflow-hidden flex flex-col justify-center items-center shadow-2xl">
            {/* Background Pattern */}
            <img
              className="absolute inset-0 w-full h-full opacity-90 object-cover pointer-events-none"
              src={artisanBakeryInterior}
              alt="Background pattern"
            />

            {/* Brand Content */}
            <div className="relative z-10 w-full p-12 flex flex-col gap-4">
              <h1 className="text-[#fff8f3] text-5xl xl:text-6xl font-serif italic leading-tight">
                Velvet Crumb
              </h1>
              <p className="text-[#fbf2ea] text-lg xl:text-xl font-serif italic leading-relaxed max-w-sm">
                Where every bite tells a story of tradition, butter, and
                artistry.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <div className="w-16 h-0.5 bg-[#eae1d9]" />
                <span className="text-[#eae1d9] text-[10px] font-bold uppercase tracking-[2px]">
                  THE EDITORIAL ISSUE Nº 01
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center relative h-full">
          {/* Form Container */}
          <div className="w-full max-w-90 flex flex-col gap-8 z-10">
            {/* Welcome Text */}
            <div className="flex flex-col gap-1">
              <h2 className="text-[#6f0001] text-3xl font-serif">
                Welcome Back
              </h2>
              <p className="text-sm opacity-80">
                Sign in to access your curated selection.
              </p>
            </div>

            {/* Input Fields */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="coco@xuongphepthuat.com"
                  className="w-full px-5 py-3.5 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#6f0001]/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider">
                    Password
                  </label>
                  <button className="text-[#6f0001] text-[10px] hover:underline cursor-pointer">
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-[#fbf2ea] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#6f0001]/10 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-3.5 h-3.5 accent-[#6f0001] cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs cursor-pointer">
                  Remember me
                </label>
              </div>

              <button className="w-full py-4 mt-2 bg-[#9a0002] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-[#8a0001] transition-all active:scale-[0.98] cursor-pointer">
                Sign In
              </button>

              <div className="text-center text-xs pt-2 opacity-60">
                <span>New here? </span>
                <Link
                  to="/register"
                  className="text-[#6f0001] font-semibold hover:underline cursor-pointer"
                >
                  Create an account
                </Link>
              </div>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#6f0001]/10"></div>
                <span className="text-[10px] uppercase tracking-tighter opacity-40">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-[#6f0001]/10"></div>
              </div>

              <div className="flex justify-center gap-5">
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

export default Login;
