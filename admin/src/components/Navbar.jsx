import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("aToken");
    localStorage.removeItem("dToken");

    setToken("");
    setDToken("");

    navigate("/");
  };

  const role = aToken ? "Admin" : "Doctor";

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <img
          src={assets.admin_logo}
          alt="logo"
          className="w-32 sm:w-36 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {role} Panel
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Profile Circle */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
            {role.charAt(0)}
          </div>
          <p className="text-sm font-medium text-slate-700">{role}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;