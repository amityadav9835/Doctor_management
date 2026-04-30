import doctorModel from "../models/doctor.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import appointmentModel from "../models/appointmentModel.js";
import { ensurePaidVideoMeeting } from "../services/videoMeeting.js";
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

const releaseDoctorSlot = async (docId, slotDate, slotTime) => {
  const doctorData = await doctorModel.findById(docId);

  if (!doctorData) {
    return { released: false, reason: "Doctor not found" };
  }

  const slotsBooked = doctorData.slots_booked || {};

  if (!slotsBooked[slotDate]) {
    return { released: false, reason: "Slot date not booked" };
  }

  const beforeCount = slotsBooked[slotDate].length;

  slotsBooked[slotDate] = slotsBooked[slotDate].filter(
    (time) => time !== slotTime
  );

  const released = slotsBooked[slotDate].length !== beforeCount;

  if (slotsBooked[slotDate].length === 0) {
    delete slotsBooked[slotDate];
  }

  await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

  return {
    released,
    reason: released ? "Slot released" : "Slot time was not booked",
  };
};
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
    const safeAppointments = await Promise.all(
      appointments.map((appointment) =>
        ensurePaidVideoMeeting(appointment, appointmentModel)
      )
    );

    console.log("Doctor ID:", docId);
    console.log("Appointments:", appointments);

    res.json({
      success: true,
      appointments: safeAppointments,
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

    const previousStatus = appointment.status;

    appointment.status = status;

    await appointment.save();

    const slotRelease = ["completed", "cancelled"].includes(status)
      ? await releaseDoctorSlot(docId, appointment.slotDate, appointment.slotTime)
      : { released: false, reason: "Status does not release slot" };

    return res.status(200).json({
      success: true,
      message: slotRelease.released
        ? "Status updated and slot released"
        : "Status updated successfully",
      appointment,
      slotRelease,
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
