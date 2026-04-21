import mongoose from "mongoose";
const connectDB = async () => {
    mongoose.connection.on('connected', () => 
        console.log("Database connected")
    );

    await mongoose.connect(`${process.env.MONGODB_URL}/prescripto`)
.then(() => {
    console.log("✅ Database connected");
})
.catch((err) => {
    console.error("❌ Error:", err);
});
};

export default connectDB;