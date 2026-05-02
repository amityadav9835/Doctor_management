import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/user.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctor.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import crypto from 'crypto'
import {
  createVideoMeeting,
  ensurePaidVideoMeeting,
} from '../services/videoMeeting.js'
import {
  notifyAppointmentBooked,
  notifyAppointmentCancelled,
  notifyPaymentConfirmed,
} from '../services/notificationService.js'

const cleanEnv = (value = '') => value.trim().replace(/^['"]|['"]$/g, '').trim()

const getRazorpayConfig = () => ({
  keyId: cleanEnv(process.env.RAZORPAY_KEY_ID || process.env.TEST_API_KEY),
  keySecret: cleanEnv(
    process.env.RAZORPAY_KEY_SECRET || process.env.TEST_KEY_SECRET
  ),
  currency: cleanEnv(process.env.CURRENCY) || 'INR',
})

const getRazorpayInstance = () => {
  const { keyId, keySecret } = getRazorpayConfig()

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are missing in backend .env')
  }

  if (!/^rzp_(test|live)_/.test(keyId)) {
    throw new Error('Invalid Razorpay key id format in backend .env')
  }

  return new razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

const getPaymentErrorMessage = (error) =>
  error?.statusCode === 401 ||
  /authentication failed/i.test(error?.error?.description || '')
    ? 'Razorpay authentication failed. Check that backend RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are from the same Razorpay account and same test/live mode.'
    : error?.error?.description ||
      error?.error?.reason ||
      error?.response?.data?.error?.description ||
      error?.response?.data?.message ||
      error?.message ||
      'Unable to create payment order'

const parseSlotDateTime = (slotDate = '', slotTime = '') => {
  const [day, month, year] = String(slotDate).split('_').map(Number)
  const match = String(slotTime).match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i)

  if (!day || !month || !year || !match) return null

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[3]?.toUpperCase()

  if (meridiem === 'PM' && hours < 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0

  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

const isPastSlot = (slotDate, slotTime) => {
  const appointmentDateTime = parseSlotDateTime(slotDate, slotTime)

  if (!appointmentDateTime) return true

  return appointmentDateTime.getTime() < Date.now()
}

// ==================== API TO REGISTER USER ====================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !password || !email) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter valid email' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter strong password' })
    }

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    return res.json({ success: true, token })
  } catch (error) {
    console.log('registerUser error:', error)
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// ==================== API FOR USER LOGIN ====================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    return res.json({ success: true, token })
  } catch (error) {
    console.log('loginUser error:', error)
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// ==================== API TO GET USER PROFILE DATA ====================
const getProfile = async (req, res) => {
  try {
    const userId = req.userId
    const userData = await userModel.findById(userId).select('-password')

    if (!userData) {
      return res.json({ success: false, message: 'User not found' })
    }

    return res.json({ success: true, userData })
  } catch (error) {
    console.log('getProfile error:', error)
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// ==================== API TO UPDATE USER PROFILE ====================
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: 'Missing Details',
      })
    }

    let parsedAddress = address
    if (typeof address === 'string') {
      try {
        parsedAddress = JSON.parse(address)
      } catch (err) {
        return res.json({
          success: false,
          message: 'Invalid address format',
        })
      }
    }

    const parsedDob = new Date(dob)
    if (isNaN(parsedDob.getTime())) {
      return res.json({
        success: false,
        message: 'Invalid date of birth',
      })
    }

    const updatedData = {
      name,
      phone,
      address: parsedAddress,
      dob: parsedDob,
      gender,
    }

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      })
      updatedData.image = imageUpload.secure_url
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password')

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      })
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    })
  } catch (error) {
    console.log('updateProfile error:', error)
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// ==================== API TO BOOK APPOINTMENT ====================
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime, consultationType = 'clinic' } = req.body
    const userId = req.userId

    if (!docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: 'Missing Details',
      })
    }

    if (!['clinic', 'video'].includes(consultationType)) {
      return res.json({
        success: false,
        message: 'Invalid consultation type',
      })
    }

    if (isPastSlot(slotDate, slotTime)) {
      return res.json({
        success: false,
        message: 'Cannot book an appointment for a past date or time',
      })
    }

    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' })
    }

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' })
    }

    let slots_booked = docData.slots_booked || {}

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    const userData = await userModel.findById(userId).select('-password')
    if (!userData) {
      return res.json({ success: false, message: 'User not found' })
    }

    const userDataObj = userData.toObject()
    const docDataObj = docData.toObject()

    delete docDataObj.slots_booked

    const videoMeeting =
      consultationType === 'video'
        ? createVideoMeeting()
        : { meetingRoom: '', meetingUrl: '' }

    const appointmentData = {
      userId,
      docId,
      userData: userDataObj,
      docData: docDataObj,
      amount: docData.fees,
      slotTime,
      slotDate,
      consultationType,
      meetingRoom: videoMeeting.meetingRoom,
      meetingUrl: videoMeeting.meetingUrl,
      date: Date.now(),
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    try {
      await notifyAppointmentBooked(newAppointment)
    } catch (error) {
      console.log('appointment notification error:', error.message)
    }

    return res.json({
      success: true,
      message:
        consultationType === 'video'
          ? 'Virtual appointment booked'
          : 'Appointment booked',
      appointment: newAppointment,
    })
  } catch (error) {
    console.log('bookAppointment error:', error)
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// ==================== API TO GET APPOINTMENTS FOR FRONTEND ====================
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 })

    const safeAppointments = await Promise.all(
      appointments.map((appointment) =>
        ensurePaidVideoMeeting(appointment, appointmentModel)
      )
    )

    return res.json({
      success: true,
      appointments: safeAppointments,
    })
  } catch (error) {
    console.log('listAppointment error:', error)
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// ==================== API TO CANCEL APPOINTMENT ====================
const cancleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const userId = req.userId

    if (!appointmentId) {
      return res.json({
        success: false,
        message: 'Appointment id is required',
      })
    }

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({ success: false, message: 'Appointment not found' })
    }

    if (appointmentData.status === 'cancelled') {
      return res.json({ success: false, message: 'Appointment already cancelled' })
    }

    if (appointmentData.payment) {
      return res.json({
        success: false,
        message: 'Paid appointment cannot be cancelled directly',
      })
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Unauthorized' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'cancelled' })

    try {
      await notifyAppointmentCancelled(appointmentData)
    } catch (error) {
      console.log('cancel notification error:', error.message)
    }

    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)

    if (doctorData) {
      let slots_booked = doctorData.slots_booked || {}

      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (e) => e !== slotTime
        )

        if (slots_booked[slotDate].length === 0) {
          delete slots_booked[slotDate]
        }
      }

      await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    }

    return res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    console.log('cancleAppointment error:', error)
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

// ==================== API TO MAKE PAYMENT OF APPOINTMENT ====================
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const userId = req.userId

    if (!appointmentId) {
      return res.json({
        success: false,
        message: 'Appointment id is required',
      })
    }

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({
        success: false,
        message: 'Appointment not found',
      })
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: 'Unauthorized',
      })
    }

    if (appointmentData.status === 'cancelled') {
      return res.json({
        success: false,
        message: 'Appointment is cancelled',
      })
    }

    if (appointmentData.payment) {
      return res.json({
        success: false,
        message: 'Payment already completed',
      })
    }

    const { keyId, currency } = getRazorpayConfig()
    const amount = Math.round(Number(appointmentData.amount) * 100)

    if (!Number.isFinite(amount) || amount < 100) {
      return res.json({
        success: false,
        message: 'Invalid appointment amount for payment',
      })
    }

    const options = {
      amount,
      currency,
      receipt: appointmentId.toString(),
    }

    const order = await getRazorpayInstance().orders.create(options)

    return res.json({ success: true, order, keyId })
  } catch (error) {
    console.log('paymentRazorpay error:', error)
    return res.json({
      success: false,
      message: getPaymentErrorMessage(error),
      code: error?.error?.code || error?.statusCode || 'PAYMENT_ORDER_FAILED',
    })
  }
}

// ==================== API TO VERIFY RAZORPAY PAYMENT ====================
const verifyRazorpay = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body

    const userId = req.userId

    if (
      !appointmentId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.json({
        success: false,
        message: 'Missing payment details',
      })
    }

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({
        success: false,
        message: 'Appointment not found',
      })
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: 'Unauthorized',
      })
    }

    if (appointmentData.status === 'cancelled') {
      return res.json({
        success: false,
        message: 'Cancelled appointment cannot be paid',
      })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`

    const { keySecret } = getRazorpayConfig()

    if (!keySecret) {
      return res.json({
        success: false,
        message: 'Razorpay secret key is missing in backend .env',
      })
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: 'Payment verification failed',
      })
    }

    const updateData = {
      payment: true,
    }

    if (
      appointmentData.consultationType === 'video' &&
      (!appointmentData.meetingUrl || !appointmentData.meetingRoom)
    ) {
      Object.assign(updateData, createVideoMeeting())
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    )
    try {
      await notifyPaymentConfirmed(updatedAppointment)
    } catch (error) {
      console.log('payment notification error:', error.message)
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      appointment: updatedAppointment,
    })
  } catch (error) {
    console.log('verifyRazorpay error:', error)
    return res.json({
      success: false,
      message: getPaymentErrorMessage(error),
      code: error?.error?.code || error?.statusCode || 'PAYMENT_VERIFY_FAILED',
    })
  }
}

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancleAppointment,
  paymentRazorpay,
  verifyRazorpay,
}
