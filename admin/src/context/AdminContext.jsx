import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { doctors } from "../../../fronted/src/assets/assets_frontend/assets";
export const AdminContext  = createContext()
import axios from "axios";
const AdmincontextProvider = (props) =>{
     const [aToken, setToken]= useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
     const backendUrl = import.meta.env.VITE_BACKEND_URL
      const [doctors, setDoctors] = useState([]);
      const [appointments, setAppointments] = useState([]);
     // Get all doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        {
          headers: {
            aToken: aToken,
          },
        }
      );
     

      if (data.success) {
        setDoctors(data.doctors);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const getAllAppointments= async ()=>{
    try {
      const {data} = await axios.get(backendUrl+'/api/admin/appointments', {headers:{aToken}});
      if(data.success){
        setAppointments(data.appointments);
      }
    } catch (error) {
        console.log(error);
      toast.error(error.message);
    }
  }

const changeAvailability = async (docId) => {
  try {
    const { data } = await axios.post(
      backendUrl + "/api/admin/change-availability",
      { docId },
      {
        headers: {
          aToken: aToken, // make sure this matches backend
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      getAllDoctors(); // refresh list
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error.message);
  }
};
    const value ={
       aToken , setToken,
       backendUrl,
       doctors,
       getAllDoctors,
       changeAvailability,
       appointments,setAppointments,
       getAllAppointments,
    };
    return (
        <AdminContext.Provider value = {value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default  AdmincontextProvider