import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mogodb.js'
import adminRouter from './routes/adminRoute.js'
import ConnectCloudinay from './config/cloudinary.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import aiRouter from './routes/aiRoute.js'
import notificationRouter from './routes/notificationRoute.js'
import { attachSignalingServer } from './services/signalingServer.js'
// app config 
const app = express()
const port = process.env.PORT || 4000
connectDB()
ConnectCloudinay()
//middlewares
app.use(express.json())
app.use(cors())

// api endpoint 
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter );
app.use('/api/ai', aiRouter)
app.use('/api/notifications', notificationRouter)
//locolhost:4000/api/admin/add-doctor
app.get('/', (req, res)=>{
      res.send("Api working ")
})

const server = app.listen(port, ()=>{
    console.log("server stated", port)
})

attachSignalingServer(server)
