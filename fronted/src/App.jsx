import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import About from "./pages/About";
import Contact from "./pages/Contact"; // ✅ fixed
import PredictDisease from "./pages/PredictDisease";
import VideoCall from "./pages/VideoCall";

import Navbar from "./components/Navbar";
import Header from "./components/Header"; // ✅ fixed
import Footer from "./components/Footer";
import WebsiteChatbot from "./components/WebsiteChatbot";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 const App = ()=>{
 return(
 <div  className="mx-4 sm:mx-[10%]">
  <ToastContainer/>
  <Navbar />
 
  <Routes>
    <Route path = '/' element= {<Home/>}> </Route>
    <Route path = '/doctors' element= {<Doctor/>}></Route>
    <Route path = '/doctors/:speciality' element= {<Doctor/>}></Route>
    <Route path = '/login' element= {<Login/>}></Route>
    <Route path = '/about' element= {<About/>}></Route>
    <Route path = '/my-profile' element= {<MyProfile/>}></Route>
    <Route path = '/my-appointments' element= {<MyAppointments/>}></Route>
    <Route path = '/appointment/:docId' element= {<Appointment/>}></Route>
    <Route path='/contact' element= {<Contact/>}></Route>
   

<Route path="/predict" element={<PredictDisease />} />
<Route path="/video-call/:appointmentId" element={<VideoCall />} />
  </Routes>
  <WebsiteChatbot />
  <Footer />
 </div>
 )
}
export default App;
