import {
  createUser,
  getAllData,
  getUserById,
  updatedById,
  deleteById,
} from "../services/allServices.js";   // 👈 adjust filename if different

import User from "../models/index.js";
import crypto from "crypto";
import sendEmail from "../../../helpers/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();


/* =========================
   CREATE USER
========================= */
const postController = async (req, res) => {
  try {
    const user = await createUser(req.body);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      status: 201,
      data: { ...user, token },
      message: "User created successfully",
    });

  } catch (error) {
    console.error("Registration Error:", error.message);

    const statusCode =
      error.message.includes("exists") ||
      error.message.includes("required") ||
      error.message.includes("not found")
        ? 400
        : 500;

    res.status(statusCode).json({
      status: statusCode,
      message: error.message,
    });
  }
};


/* =========================
   GET ALL USERS
========================= */
const getController = async (req, res) => {
  try {
    const users = await getAllData();

    res.status(200).json({
      status: 200,
      data: users,
      message: "Users fetched successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};


/* =========================
   GET CURRENT USER
========================= */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: 200,
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


/* =========================
   UPDATE USER
========================= */
const updateController = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedUser = await updatedById(id, req.body);

    res.status(200).json({
      status: 200,
      data: updatedUser,
      message: "User updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};


/* =========================
   DELETE USER
========================= */
const deleteController = async (req, res) => {
  try {
    const id = req.params.id;

    await deleteById(id);

    res.status(200).json({
      status: 200,
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It will expire in 10 minutes.`
    );

    res.status(200).json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  postController,
  getController,
  getCurrentUser,
  deleteController,
  updateController,
  forgotPassword,
  resetPassword,
};