import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appccontext";

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
      isActive
        ? "text-indigo-600"
        : "text-slate-700 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => handleNavigate("/")}
            className="flex items-center shrink-0"
          >
            <img
              className="w-28 sm:w-32 md:w-36"
              src={assets.logo}
              alt="logo"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">

            <NavLink to="/" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  HOME
                  {isActive && <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-indigo-600" />}
                </span>
              )}
            </NavLink>

            <NavLink to="/doctors" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  ALL DOCTORS
                  {isActive && <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-indigo-600" />}
                </span>
              )}
            </NavLink>

            {/* 🔥 NEW FEATURE */}
            <NavLink to="/predict" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  AI PREDICTION
                  {isActive && <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-indigo-600" />}
                </span>
              )}
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  ABOUT
                  {isActive && <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-indigo-600" />}
                </span>
              )}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  CONTACT
                  {isActive && <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-indigo-600" />}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center">
            {token && userData ? (
              <div className="relative">

                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-full pl-1 pr-2 py-1 hover:bg-slate-100"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={userData.image || assets.profile_pic}
                    alt="user"
                  />
                  <span className="text-sm font-semibold">
                    {userData.name}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 w-56 bg-white shadow-lg rounded-xl">

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
            ) : (
              <button
                onClick={() => handleNavigate("/login")}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full"
              >
                Create Account
              </button>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-4">

          <button onClick={() => handleNavigate("/")}>HOME</button>
          <button onClick={() => handleNavigate("/doctors")}>ALL DOCTORS</button>

          {/* 🔥 NEW */}
          <button onClick={() => handleNavigate("/predict")}>
            AI PREDICTION
          </button>

          <button onClick={() => handleNavigate("/about")}>ABOUT</button>
          <button onClick={() => handleNavigate("/contact")}>CONTACT</button>

          {token ? (
            <>
              <button onClick={() => handleNavigate("/my-profile")}>
                My Profile
              </button>
              <button onClick={() => handleNavigate("/my-appointments")}>
                My Appointments
              </button>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={() => handleNavigate("/login")}>
              Create Account
            </button>
          )}
        </div>
      )}
    </header>
  );
}