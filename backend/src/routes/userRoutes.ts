import express from "express";
import {
  signUp,
  googleSignUp,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/userController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/google/signup", googleSignUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

// Admin routes
router.get("/", getAllUsers);
router.put("/:id", isAuthenticated, updateUser);
router.delete("/:id", deleteUser);

// Additional routes for password reset functionality
router.post("/verify-otp", verifyOtp); // Route for verifying OTP sent for password reset
router.post("/reset-password", resetPassword); // Route for resetting password using OTP

export default router;