import validator from "validator"
import { v2 as cloudinary } from "cloudinary"
import bcrypt from 'bcrypt'
// Api for adding doctor
import doctorModel from "../models/doctor.js"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
const addDoctor = async (req, res) => {
  try {

    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file
    console.log(req.file);
    // checking for all data to add doctor 
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: "Missing Details" })
    }

    // validating email format 
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Plesse enter a valid email" })
    }
    // validating strong possward
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" })
    }
    // hashing doctor password
    const salt = await bcrypt.genSalt(10)
    const hashesPassword = await bcrypt.hash(password, salt)
    // uplod image
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
    const imageUrl = imageUpload.secure_url

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashesPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now()



    }
    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save();
    res.json({ success: true, message: "Doctoer added" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// api for admin login
const loginAdmin = async (req, res)=>{
     try{
        const {email, password}= req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
           const token = jwt.sign(email+password, process.env.JWT_SECRET );
           res.json({success:true, token});
        }else{
          res.json({success:false , message:"invalid email and password"})
        }
     }catch(error){
      console.log(error);
      res.json({success:false , message:error.message});

     }
}
const allDoctor = async (req, res)=>{
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors});
    
  } catch (error) {
    console.log(error);
    res.json({sucess:false, message:error.message})
  }
}
// api to get all appointment list
const appoitmentsAdmin = async(req, res)=>{
  try {
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments});
  } catch (error) {
      console.log(error);
    res.json({sucess:false, message:error.message})
  }
}
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
      return res.json({
        success: false,
        message: "Missing details",
      });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Optional validation
    const validStatus = ["pending", "confirmed", "completed", "cancelled"];

    if (!validStatus.includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { status });

    return res.json({
      success: true,
      message: "Status updated successfully",
    });

  } catch (error) {
    console.log("update status error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addDoctor , loginAdmin , allDoctor, appoitmentsAdmin , updateAppointmentStatus }