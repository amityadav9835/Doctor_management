import doctorModel from "../models/doctor.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({
      success: true,
      message: "Availability Changed",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
const doctorList = async (req, res)=>{
   try {
    const doctors = await doctorModel.find({}).select(['-passwoard', '-email'])
    res.json({success:true,doctors});
    console.log(doctors);
   } catch (error) {
      res.json({
      success: false,
      message: error.message,
    });
   }
}
// api for doctor login
const loginDotor = async(req,res) =>{
  try {
     const {email, password}= req.body
     const doctor = await doctorModel.findOne({email});
     if(!doctor){
      res.json({success:false, message:"Invalid credentials"});
     }
     const ismatch = await bcrypt.compare(password, doctor.password);
     if(ismatch){
      const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET);

       res.json({success:true, token})
     }else{
        res.json({
      success: false,
      message: "password not mathed",
  })
     }

  } catch (error) {
     res.json({
      success: false,
      message: error.message,
  })
}
}
// api to get docto appointment for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId;

    const appointments = await appointmentModel.find({ docId });

    console.log("Doctor ID:", docId);
    console.log("Appointments:", appointments);

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// api to mark appointment status by doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId, status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      docId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//api for dotor pannel profile 

const doctorProfile = async (req, res)=>{
  try {
     const docId= req.docId;
     const profileData= await doctorModel.findById(docId).select('-password');
      res.json({success:true, profileData});
  } catch (error) {
        console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
// api for UPDATE doctor profile data from doctor panel
const updateProfile = async (req, res)=>
{
  try {
     const docId= req.docId;
     const {fees, address, available}= req.body
     await doctorModel.findByIdAndUpdate(docId,{fees, address, available});
     res.json({success:true, message:"profile to updated"});
  } catch (error) {
            console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export { changeAvailability , doctorList, loginDotor, appointmentsDoctor , updateAppointmentStatus, doctorProfile, updateProfile}