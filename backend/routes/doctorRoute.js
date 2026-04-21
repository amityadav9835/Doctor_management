import express from 'express'
import { appointmentsDoctor, doctorList, doctorProfile, loginDotor, updateAppointmentStatus, updateProfile } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList);
doctorRouter.post('/login', loginDotor);
doctorRouter.get('/appointments',authDoctor, appointmentsDoctor)
doctorRouter.post("/update-status", authDoctor, updateAppointmentStatus);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateProfile);
export default doctorRouter;