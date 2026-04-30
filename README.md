# Doctor Management System

A full-stack doctor appointment management platform built with the MERN stack. The project includes a patient-facing web app, an admin/doctor panel, appointment booking, online payments, video consultations, rule-based symptom triage, and in-app/email/SMS notifications.

## Features

### Patient App

- User registration and login with JWT authentication
- Browse doctors by speciality
- View doctor profile, experience, availability, fees, and address
- Book clinic or video appointments
- Cancel appointments when allowed
- Razorpay payment integration
- View appointment history and payment status
- Join paid video consultations during the allowed appointment window
- Rule-based symptom checker with:
  - patient intake fields
  - warning-sign detection
  - care-level guidance
  - recommended doctors
  - downloadable assessment report
  - recent assessment history in the browser
- Website assistant chatbot that explains how to use the application
- Notification bell with read/delete/clear actions

### Doctor Panel

- Doctor login
- View assigned appointments
- Join video consultations
- Update appointment status: pending, confirmed, cancelled, completed
- Manage profile, fees, address, and availability

### Admin Panel

- Admin login
- Add doctors
- View all doctors
- View all appointments
- Manage doctor availability

### Notifications

- In-app notifications stored in MongoDB
- Email notifications using Nodemailer
- SMS notifications using Twilio
- Appointment booked notification
- Appointment cancelled notification
- Payment confirmed notification
- Appointment reminder notification

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Admin Panel: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT, bcrypt
- File Uploads: Multer, Cloudinary
- Payments: Razorpay
- Notifications: Nodemailer, Twilio
- Video Calls: WebRTC with a custom WebSocket signaling server

## Project Structure

```text
doctor_management/
  backend/     Express API, MongoDB models, services, routes
  fronted/     Patient-facing React application
  admin/       Admin and doctor React application
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
cd backend && npm install
cd ../fronted && npm install
cd ../admin && npm install
```

### 2. Configure Environment Variables

Create or update `backend/.env`:

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
NOTIFICATION_EMAIL_FROM=your_email@gmail.com

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

Create or update `fronted/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_TEST_API_KEY=your_razorpay_public_key
```

Create or update `admin/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

### 3. Run the Applications

Backend:

```bash
cd backend
npm run server
```

Patient app:

```bash
cd fronted
npm run dev
```

Admin/doctor panel:

```bash
cd admin
npm run dev
```

Default local URLs:

```text
Backend API:     http://localhost:4000
Patient App:     http://localhost:5173
Admin Panel:     http://localhost:5174
```

## Important Notes

- Video calls require camera and microphone browser permissions.
- Video calls are available only for video appointments after payment and within the configured appointment window.
- Email notifications require valid SMTP credentials.
- SMS notifications require valid Twilio credentials and phone numbers in international format.
- The symptom checker is rule-based and informational only. It is not a medical diagnosis or emergency service.

## Useful Scripts

Backend:

```bash
npm start
npm run server
```

Frontend and admin:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## License

ISC
