import express from "express";
import {
  signUp,
  googleSignUp,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/google/signup", googleSignUp);
router.post("/login", login);

// Admin routes
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
