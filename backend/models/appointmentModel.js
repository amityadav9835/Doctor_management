import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    slotDate: {
      type: String,
      required: true,
    },

    slotTime: {
      type: String,
      required: true,
    },

       userData: {
      type: Object,
      required: true,
    },
    docData: {
      type: Object,
      required: true,
    },


    amount: {
      type: Number,
      required: true,
    },

    appointmentDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    payment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export default mongoose.model("Appointment", appointmentSchema);