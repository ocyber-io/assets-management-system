import { Router } from "express";
import {
  addFolder,
  deleteFolder,
  addFileToFolder,
  deleteFileFromFolder,
  getFoldersByUserId,
  updateFolder, // Import the updateFolder controller
  getFolderById,
  restoreFolder,
  restoreMultipleFolders,
  deleteMultipleFolders,
} from "../controllers/folderController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

// Define routes with paths
router.post("/", isAuthenticated, addFolder); // Add folder route
router.put("/:folderId", isAuthenticated, updateFolder); // Update folder route
router.get("/:folderId", isAuthenticated, getFolderById); // Get folder by Id
router.delete("/:folderId", isAuthenticated, deleteFolder); // Delete folder route
router.put("/:folderId/restore", isAuthenticated, restoreFolder); // Restore folder route
router.put("/:folderId/files", isAuthenticated, addFileToFolder); // Add file to folder route
router.delete("/:folderId/files", isAuthenticated, deleteFileFromFolder); // Delete file from folder route
router.get("/user/:userId", isAuthenticated, getFoldersByUserId); // Get folders by user ID route
router.post("/restore-multiple", isAuthenticated, restoreMultipleFolders); // Restore multiple folders
router.post("/delete-multiple", isAuthenticated, deleteMultipleFolders); // Delete multiple folders

export default router;
