import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-50 mt-16 sm:mt-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm">
          
          {/* Left */}
          <div>
            <img className="w-32 mb-4" src={assets.logo} alt="logo" />

            <p className="text-slate-600 leading-6 max-w-sm">
              Book appointments with trusted doctors easily. Our platform helps
              you find specialists, choose time slots, and manage bookings
              seamlessly.
            </p>

            {/* Social icons (optional) */}
            <div className="flex gap-3 mt-5">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm cursor-pointer hover:bg-indigo-600 hover:text-white transition">
                F
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm cursor-pointer hover:bg-indigo-600 hover:text-white transition">
                I
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm cursor-pointer hover:bg-indigo-600 hover:text-white transition">
                T
              </div>
            </div>
          </div>

          {/* Center */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Company
            </h3>

            <ul className="flex flex-col gap-2 text-slate-600">
              <li
                onClick={() => navigate("/")}
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Home
              </li>
              <li
                onClick={() => navigate("/about")}
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                About Us
              </li>
              <li
                onClick={() => navigate("/contact")}
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                Contact Us
              </li>
              <li className="cursor-pointer hover:text-indigo-600 transition">
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* Right */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Get in Touch
            </h3>

            <ul className="flex flex-col gap-2 text-slate-600">
              <li className="hover:text-indigo-600 transition">
                📞 +1-212-456-7890
              </li>
              <li className="hover:text-indigo-600 transition">
                📧 amitdev@gmail.com
              </li>
              <li className="hover:text-indigo-600 transition">
                📍 India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-slate-500">
            © 2026 <span className="font-semibold text-slate-700">Amit Kumar</span> — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}