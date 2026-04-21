import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  image: {
    type: String,
    default:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAY" // (truncated base64)
  },

  address: {
    line1: String,
    line2: String
  },

  gender: {
    type: String,
    default: "Not Selected"
  },

  dob: {
    type: Date,
   
  },

  phone: {
    type: String,
    default: "0000000000",
    match: /^[0-9]{10}$/
  }
});

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;