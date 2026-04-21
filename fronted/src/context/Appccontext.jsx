import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const Appcontext = createContext();

const Appcontextprovider = (props) => {
  const currencysymbol = "$";
  const [doctors, setDoctors] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData]= useState(false);
  const DoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const loadUserProfileData = async () =>{
       try {
        const {data}= await axios.get(backendUrl + '/api/user/get-profile', {headers:{token}})
        if(data.success){
          setUserData(data.userData);
        }else{
          toast.error(data.message);
        }
       } catch (error) {
           console.log(error);
      toast.error(error.message);
       }
  }

  useEffect(() => {
    DoctorsData();
  }, []);
  useEffect(()=>{
    if(token){
      loadUserProfileData();
    }else{
      setUserData(false)
    }
  }, [token])

  const value = {
    doctors,
    DoctorsData,
    currencysymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData
  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};

export default Appcontextprovider;