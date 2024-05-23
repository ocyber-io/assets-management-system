import express from "express";
import {
  addFile,
  getUserFiles,
  renameFile,
  deleteFile,
  toggleFileDisable,
  replaceFile,
  restoreFile,
  toggleFileFavorite,
  toggleMultipleFilesFavorite,
  deleteMultipleFiles,
  restoreMultipleFiles,
  disableMultipleFiles,
  sendFileByEmail,
  searchFiles,
} from "../controllers/fileController";
import { isAuthenticated } from "../middlewares/authMiddleware";
const router = express.Router();

// Routes for file operations
router.post("/add", addFile); // POST endpoint for adding a file
router.get("/user/:userId", getUserFiles); // GET endpoint to fetch all files for a specific user
router.patch("/rename/:fileId", renameFile); // PATCH endpoint for renaming a specific file
router.delete("/delete/:fileId", deleteFile); // DELETE endpoint for deleting a specific file
router.patch("/:fileId/toggleDisable", toggleFileDisable); // PATCH endpoint for toggle disabling

// route for replacing a file
router.patch("/replace/:fileId", replaceFile);

// route for restoring a file
router.patch("/restore/:fileId", restoreFile);

// route for toggling file favorite status
router.patch("/toggleFavorite/:fileId", toggleFileFavorite);

// route for toggling multiple files to favorites
router.patch("/toggleMultipleFavorite", toggleMultipleFilesFavorite);

// route for deleting multiple files
router.delete("/deleteMultiple", deleteMultipleFiles);

// route for deleting multiple files
router.patch("/restoreMultiple", restoreMultipleFiles);

// route for deleting multiple files
router.patch("/disableMultiple", disableMultipleFiles);

// route for deleting multiple files
router.post("/sendByEmail/:fileId", sendFileByEmail);

// route for searching a file
router.get("/search", isAuthenticated, searchFiles);
export default router;
