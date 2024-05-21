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
} from "../controllers/folderController";

const router = Router();

// Define routes with paths
router.post("/", addFolder); // Add folder route
router.put("/:folderId", updateFolder); // Update folder route
router.get("/:folderId", getFolderById); // Update folder route
router.delete("/:folderId", deleteFolder); // Delete folder route
router.put("/:folderId/restore", restoreFolder); // Restore folder route
router.put("/:folderId/files", addFileToFolder); // Add file to folder route
router.delete("/:folderId/files", deleteFileFromFolder); // Delete file from folder route
router.get("/user/:userId", getFoldersByUserId); // Get folders by user ID route

export default router;
