import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  userData: {
    name: String,
    email: String,
    password: String,
  },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 minutes
});

export default mongoose.model("Otp", otpSchema);
