import express from "express";
import { addFile, getUserFiles } from "../controllers/fileController";

const router = express.Router();

// POST /api/files/add
router.post("/add", addFile);
router.get("/user/:userId", getUserFiles);

export default router;
