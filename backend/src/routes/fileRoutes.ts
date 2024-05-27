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
router.post("/add", isAuthenticated, addFile); // POST endpoint for adding a file
router.get("/user/:userId", isAuthenticated, getUserFiles); // GET endpoint to fetch all files for a specific user
router.patch("/rename/:fileId", isAuthenticated, renameFile); // PATCH endpoint for renaming a specific file
router.delete("/delete/:fileId", isAuthenticated, deleteFile); // DELETE endpoint for deleting a specific file
router.patch("/:fileId/toggleDisable", isAuthenticated, toggleFileDisable); // PATCH endpoint for toggle disabling

// route for replacing a file
router.patch("/replace/:fileId", isAuthenticated, replaceFile);

// route for restoring a file
router.patch("/restore/:fileId", isAuthenticated, restoreFile);

// route for toggling file favorite status
router.patch("/toggleFavorite/:fileId", isAuthenticated, toggleFileFavorite);

// route for toggling multiple files to favorites
router.patch("/toggleMultipleFavorite", isAuthenticated, toggleMultipleFilesFavorite);

// route for deleting multiple files
router.delete("/deleteMultiple", isAuthenticated, deleteMultipleFiles);

// route for deleting multiple files
router.patch("/restoreMultiple", isAuthenticated, restoreMultipleFiles);

// route for deleting multiple files
router.patch("/disableMultiple", isAuthenticated, disableMultipleFiles);

// route for deleting multiple files
router.post("/sendByEmail/:fileId", isAuthenticated, sendFileByEmail);

// route for searching a file
router.get("/search", isAuthenticated, isAuthenticated, searchFiles);
export default router;
