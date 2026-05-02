import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appccontext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { token, setToken, userData } = useContext(Appcontext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMenuOpen(false);
    setProfileOpen(false);
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-all duration-300 ${
      isActive ? "text-indigo-600" : "text-slate-700 hover:text-indigo-600"
    }`;

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ALL DOCTORS", path: "/doctors" },
    { label: "RECOMMEND DOCTOR", path: "/predict" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between">
          <button
            onClick={() => handleNavigate("/")}
            className="flex items-center shrink-0"
          >
            <img className="w-28 sm:w-32 md:w-36" src={assets.logo} alt="logo" />
          </button>

          <nav className="hidden md:flex items-center gap-7 rounded-full border border-slate-200 bg-white/70 px-5 py-2 shadow-sm">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>
                {({ isActive }) => (
                  <span className="relative">
                    {item.label}
                    {isActive && (
                      <span className="absolute left-0 -bottom-2 h-[2px] w-full rounded-full bg-indigo-600" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            {token && userData ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-full border border-transparent pl-1 pr-3 py-1 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={userData.image || assets.profile_pic}
                    alt="user"
                  />
                  <span className="text-sm font-semibold">{userData.name}</span>
                </button>

                {profileOpen && (
                  <div className="animate-fade-up absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <button
                      onClick={() => handleNavigate("/my-profile")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </button>

                    <button
                      onClick={() => handleNavigate("/my-appointments")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Appointments
                    </button>

                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate("/login")}
                className="rounded-full bg-indigo-600 px-5 py-2 text-white shadow-md shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
              >
                Create Account
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-fade-up md:hidden border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="text-left text-sm font-semibold text-slate-700"
              >
                {item.label}
              </button>
            ))}

            {token ? (
              <>
                <div className="py-1">
                  <NotificationBell />
                </div>
                <button
                  onClick={() => handleNavigate("/my-profile")}
                  className="text-left text-sm font-semibold text-slate-700"
                >
                  My Profile
                </button>
                <button
                  onClick={() => handleNavigate("/my-appointments")}
                  className="text-left text-sm font-semibold text-slate-700"
                >
                  My Appointments
                </button>
                <button
                  onClick={logout}
                  className="text-left text-sm font-semibold text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate("/login")}
                className="text-left text-sm font-semibold text-indigo-600"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
