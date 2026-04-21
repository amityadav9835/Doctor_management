🏥 Doctor Management System

A full-stack Doctor Appointment Booking & Management Web Application built using the MERN stack. This platform allows users to book appointments, doctors to manage schedules, and admins to control the system.

🚀 Features
👤 User Panel
Register & Login (JWT Authentication)
View doctors by speciality
Book & cancel appointments
Online payment integration (Razorpay)
View appointment history
Update profile
👨‍⚕️ Doctor Panel
Doctor login
View assigned appointments
Update appointment status
Manage availability
🛠️ Admin Panel
Add / remove doctors
View all doctors
View all appointments
Manage platform data
🧰 Tech Stack
Frontend
React.js
Tailwind CSS
Axios
React Router
React Toastify
Backend
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Multer (File Upload)
Third-Party Services
Cloudinary (Image storage)
Razorpay (Payment gateway)
📂 Folder Structure
Doctor-Management-System/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── assets/
│   │   └── App.jsx
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
🔐 Authentication
JWT-based authentication system
Tokens stored in localStorage:
token → User
aToken → Admin
dToken → Doctor
💳 Payment Integration
Razorpay used for secure online payments
Backend creates order
Payment verified after success
☁️ Image Upload
Cloudinary used for storing doctor images
Multer handles file uploads
⚙️ Environment Variables

Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key

RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret

CURRENCY=INR
🛠️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/doctor-management.git
cd doctor-management
2️⃣ Backend Setup
cd backend
npm install
npm run server
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🌐 API Endpoints
User
POST /api/user/register
POST /api/user/login
GET /api/user/profile
POST /api/user/book-appointment
POST /api/user/cancel-appointment
Doctor
GET /api/doctor/appointments
POST /api/doctor/update-status
Admin
POST /api/admin/login
GET /api/admin/all-doctors
POST /api/admin/add-doctor
📸 Screenshots

Add your project screenshots here

📈 Future Enhancements
🤖 AI-based disease prediction
💬 Chatbot (LLM integration)
📱 Mobile application
🔔 Email/SMS notifications
📊 Admin analytics dashboard
🧑‍💻 Author
B.Tech IT Student
Full Stack Developer
⭐ Contributing

Contributions are welcome!

Fork the repository
Create a new branch
Commit your changes
Push to branch
Open a Pull Request
📜 License

This project is licensed under the MIT License.