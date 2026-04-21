import { useContext } from "react";
import "./App.css";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sdebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointments from "./pages/Admin/AllApointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken} = useContext(DoctorContext);
  return aToken || dToken ? (
    <div className="bg-[#F8F9FD] min-h-screen">
      <ToastContainer />
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-4">
          <Routes>
            {/* Admin route  */}
            <Route path="/" element={<div></div>} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllApointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />
            {/* doctor route  */}
            <Route path="/doctor-appointments" element={<DoctorAppointment />} />
             <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
              <Route path="/doctor-profile" element={<DoctorProfile/>} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;