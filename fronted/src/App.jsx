 import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Doctor from "./pages/doctor";
import Login from "./pages/login";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Header from "./components/header";
import Footer from "./components/Footer";
import Contact from "./pages/contact";
 import PredictDisease from "./pages/PredictDisease";
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
  </Routes>
  <Footer />
 </div>
 )
}
export default App;