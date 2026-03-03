import bcrypt from "bcryptjs";
import User from "../models/index.js";
import userValidation from "../validations/userValidation.js";

/* =========================
   CREATE USER
========================= */
const createUser = async (userData) => {
  const { error } = userValidation(userData);
  if (error) {
    throw new Error(error.details.map((err) => err.message).join(", "));
  }

  const { name, email, password, profilePicture, coverPicture } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profilePicture,
    coverPicture,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

/* =========================
   GET ALL USERS
========================= */
const getAllData = async () => {
  const users = await User.find({}).select("-password");

  if (!users.length) {
    throw new Error("No users found");
  }

  return users;
};

/* =========================
   GET USER BY ID
========================= */
const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/* =========================
   UPDATE USER BY ID
========================= */
const updatedById = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

/* =========================
   DELETE USER BY ID
========================= */
const deleteById = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return { message: "User deleted successfully" };
};

export {
  createUser,
  getAllData,
  getUserById,
  updatedById,
  deleteById,
};