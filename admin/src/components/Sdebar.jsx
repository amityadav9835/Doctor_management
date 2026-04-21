import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (!aToken && !dToken) return null;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-[260px] min-h-[calc(100vh-70px)] bg-white border-r border-slate-200 shadow-sm flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">
          {aToken ? "Admin Panel" : "Doctor Panel"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">Manage your system</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        <NavLink
          to={aToken ? "/admin-dashboard" : "/doctor-dashboard"}
          className={linkClass}
        >
          <img src={assets.home_icon} alt="" className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to={aToken ? "/all-appointments" : "/doctor-appointments"}
          className={linkClass}
        >
          <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
          <span>Appointments</span>
        </NavLink>

        {aToken && (
          <NavLink to="/add-doctor" className={linkClass}>
            <img src={assets.add_icon} alt="" className="w-5 h-5" />
            <span>Add Doctor</span>
          </NavLink>
        )}

        <NavLink
          to={aToken ? "/doctor-list" : "/doctor-profile"}
          className={linkClass}
        >
          <img src={assets.people_icon} alt="" className="w-5 h-5" />
          <span>{aToken ? "Doctors List" : "Profile"}</span>
        </NavLink>
      </nav>

      <div className="px-5 py-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          © 2026 {aToken ? "Admin Panel" : "Doctor Panel"}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;