import React, { useState, useContext, useEffect } from "react";
import { Appcontext } from "../context/Appccontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, token, setToken } = useContext(Appcontext);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created successfully");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 text-white">
            <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
              Welcome to Prescripto
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Book trusted doctor appointments with ease
            </h1>

            <p className="mt-4 max-w-md text-white/85 leading-7">
              Manage your healthcare journey with a smooth and secure platform
              designed for quick booking, trusted doctors, and a better user
              experience.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">100+</p>
                <p className="mt-1 text-sm text-white/80">Doctors</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">10k+</p>
                <p className="mt-1 text-sm text-white/80">Bookings</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-bold">24/7</p>
                <p className="mt-1 text-sm text-white/80">Access</p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
            <form
              onSubmit={onSubmitHandler}
              className="w-full max-w-md"
            >
              <div className="text-center lg:text-left">
                <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1 text-xs sm:text-sm font-medium text-indigo-700">
                  {state === "Sign Up" ? "Create Account" : "Welcome Back"}
                </span>

                <h2 className="mt-4 text-3xl font-bold text-slate-800">
                  {state === "Sign Up" ? "Sign Up" : "Login"}
                </h2>

                <p className="mt-2 text-sm sm:text-base text-slate-500 leading-6">
                  {state === "Sign Up"
                    ? "Create your account to start booking appointments with trusted doctors."
                    : "Login to manage your appointments and access your healthcare dashboard."}
                </p>
              </div>

              <div className="mt-8 space-y-5">
                {state === "Sign Up" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? state === "Sign Up"
                    ? "Creating Account..."
                    : "Logging In..."
                  : state === "Sign Up"
                  ? "Create Account"
                  : "Login"}
              </button>

              <div className="mt-6 text-center text-sm text-slate-500">
                {state === "Sign Up"
                  ? "Already have an account? "
                  : "Don’t have an account? "}
                <button
                  type="button"
                  onClick={() =>
                    setState(state === "Sign Up" ? "Login" : "Sign Up")
                  }
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  {state === "Sign Up" ? "Login here" : "Sign up here"}
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-slate-400 leading-5">
                By continuing, you agree to our terms and help us provide a
                secure healthcare booking experience.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}