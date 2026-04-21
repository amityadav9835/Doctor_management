import { v2 as cloudinary } from "cloudinary";
const ConnectCloudinay = async ()=>{
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
console.log("cloud_name =", process.env.CLOUDINARY_NAME);
console.log("api_key =", process.env.CLOUDINARY_API_KEY);
console.log("api_secret exists =", !!process.env.CLOUDINARY_SECRET_KEY);
}

export default ConnectCloudinay