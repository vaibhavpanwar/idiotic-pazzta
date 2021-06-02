import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { phone, password, role } = req.body;

  const userExists = await User.findOne({ phone });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    phone,
    password,
    role:
      role === "user" || role === "admin" || role === "diliveryPerson"
        ? role
        : "user",
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    list all users with role filter
// @route   GET /api/users/all
// @access  admin
const getAllUsers = asyncHandler(async (req, res) => {
  const filter = req.query.role;

  if (filter) {
    const users = await User.find({ role: filter });
    if (users) {
      res.json(users);
    } else {
      res.status(404);
      throw new Error("No Found");
    }
  }
  const allUsers = await User.find().select("-password");

  if (allUsers) {
    res.json(allUsers);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { authUser, registerUser, getUserProfile, getAllUsers };
