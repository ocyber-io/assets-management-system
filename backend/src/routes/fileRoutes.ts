import express from "express";
import {
  addFile,
  getUserFiles,
  renameFile,
} from "../controllers/fileController";

const router = express.Router();

// POST /api/files/add
router.post("/add", addFile);
router.get("/user/:userId", getUserFiles);
router.patch("/rename/:fileId", renameFile);

export default router;
