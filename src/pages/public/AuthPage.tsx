import React from "react";
import { artisanBakeryInterior } from "../../assets/login/index";
import { Outlet } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <div className="bg-secondary">
      <div className="mx-auto h-screen w-300 font-sans antialiased text-[#5b403c] overflow-hidden flex flex-col">
        {/* Container */}
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

          {/* Right Side: Login/Register Form */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Login;
