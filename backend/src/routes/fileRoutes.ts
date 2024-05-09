import express from "express";
import {
  addFile,
  getUserFiles,
  renameFile,
  deleteFile,
} from "../controllers/fileController";

const router = express.Router();

// Routes for file operations
router.post("/add", addFile); // POST endpoint for adding a file
router.get("/user/:userId", getUserFiles); // GET endpoint to fetch all files for a specific user
router.patch("/rename/:fileId", renameFile); // PATCH endpoint for renaming a specific file
router.delete("/delete/:fileId", deleteFile); // DELETE endpoint for deleting a specific file

export default router;
