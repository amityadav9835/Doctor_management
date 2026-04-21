import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/user.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctor.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import crypto from 'crypto'

// ==================== RAZORPAY INSTANCE ====================
const razorpayInstance = new razorpay({
  key_id: process.env.TEST_API_KEY,
  key_secret: process.env.TEST_KEY_SECRET
})

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
    const { docId, slotDate, slotTime } = req.body
    const userId = req.userId

    if (!docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: 'Missing Details',
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

    const appointmentData = {
      userId,
      docId,
      userData: userDataObj,
      docData: docDataObj,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    return res.json({ success: true, message: 'Appointment booked' })
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

    return res.json({
      success: true,
      appointments,
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

    const options = {
      amount: Number(appointmentData.amount) * 100,
      currency: process.env.CURRENCY || 'INR',
      receipt: appointmentId,
    }

    const order = await razorpayInstance.orders.create(options)

    return res.json({ success: true, order })
  } catch (error) {
    console.log('paymentRazorpay error:', error)
    return res.json({
      success: false,
      message: error.message,
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

    const expectedSignature = crypto
      .createHmac('sha256', process.env.TEST_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: 'Payment verification failed',
      })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
     
    })

    return res.json({
      success: true,
      message: 'Payment verified successfully',
    })
  } catch (error) {
    console.log('verifyRazorpay error:', error)
    return res.json({
      success: false,
      message: error.message,
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