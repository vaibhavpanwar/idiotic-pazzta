import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  getAllUsers,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser);
router.route("/all").get(protect, admin, getAllUsers);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
export default router;
