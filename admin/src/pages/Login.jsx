import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {setToken, backendUrl} = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
       if(state == 'Admin'){
          const {data}= await axios.post(backendUrl+'/api/admin/login', {email,password})
          if(data.success){
            setToken(data.token);
            localStorage.setItem('aToken', data.token);
            console.log(data.token);
          }
          else{
            toast.error(data.message);
       }
       }else{
                const {data} = await axios.post(backendUrl +'/api/doctor/login', {email,password});
                   if(data.success){
            setDToken(data.token);
            localStorage.setItem('dToken', data.token);
            console.log(data.token);
          }
          else{
            toast.error(data.message);
       }
       }
    }catch(error){

    }

    // Simulate API call
    setTimeout(() => {
      console.log({ state, email, password });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-[350px] sm:w-[400px] transition-all duration-300 hover:shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {state} Login
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Welcome back 👋
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1 text-sm">Email</label>
          <input
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-gray-600 mb-1 text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition duration-300 shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg text-white"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Toggle Login */}
        <div className="text-center mt-5 text-sm">
          {state === "Admin" ? (
            <p className="text-gray-600">
              Login as Doctor?{" "}
              <span
                onClick={() => setState("Doctor")}
                className="text-indigo-500 cursor-pointer font-semibold hover:underline"
              >
                Click here
              </span>
            </p>
          ) : (
            <p className="text-gray-600">
              Login as Admin?{" "}
              <span
                onClick={() => setState("Admin")}
                className="text-indigo-500 cursor-pointer font-semibold hover:underline"
              >
                Click here
              </span>
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-4">
          Secure Access 🔒
        </p>
      </form>
    </div>
  );
};

export default Login;