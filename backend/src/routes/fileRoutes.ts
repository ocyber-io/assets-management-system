import express from "express";
import {
  addFile,
  getUserFiles,
  renameFile,
  deleteFile,
  toggleFileDisable,
  replaceFile,
  restoreFile, // Import the replaceFile controller function
} from "../controllers/fileController";

const router = express.Router();

// Routes for file operations
router.post("/add", addFile); // POST endpoint for adding a file
router.get("/user/:userId", getUserFiles); // GET endpoint to fetch all files for a specific user
router.patch("/rename/:fileId", renameFile); // PATCH endpoint for renaming a specific file
router.delete("/delete/:fileId", deleteFile); // DELETE endpoint for deleting a specific file
router.patch("/:fileId/toggleDisable", toggleFileDisable); // PATCH endpoint for toggle disabling

// Add the route for replacing a file
router.patch("/replace/:fileId", replaceFile);

// Add the route for restoring a file
router.patch("/restore/:fileId", restoreFile);

export default router;
