import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Setup Nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  Register — Send OTP
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registering user:", { name, email, password });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove previous OTPs for this email
    await Otp.deleteMany({ email });

    // Store OTP in DB 
    await Otp.create({
      email,
      otp,
      userData: { name, email, password },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is <b>${otp}</b></h3><p>This OTP is valid for 5 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Verify OTP and Create User
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const entry = await Otp.findOne({ email });

    if (!entry || entry.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.create(entry.userData);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    await Otp.deleteOne({ _id: entry._id }); // Clean up OTP

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: err.message });
  }
};

//Standard Login with Cookie
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ ALSO send token in JSON response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // ✅ Send token here
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


