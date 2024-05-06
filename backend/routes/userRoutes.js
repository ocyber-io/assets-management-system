import express from "express";
import {
  signUp,
  googleSignUp,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/google/signup", googleSignUp);
router.post("/login", login);

// Admin routes
router.get("/", getAllUsers); // This route should check if the user is an admin
router.put("/:id", updateUser); // This route should check if the user is an admin
router.delete("/:id", deleteUser); // This route should check if the user is an admin

export default router;
