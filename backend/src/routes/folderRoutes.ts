import { Router } from "express";
import {
  addFolder,
  deleteFolder,
  addFileToFolder,
  deleteFileFromFolder,
  getFoldersByUserId,
  updateFolder, // Import the updateFolder controller
} from "../controllers/folderController";

const router = Router();

router.post("/", addFolder);
router.put("/:folderId", updateFolder); // Add the PUT route for updating a folder
router.delete("/:folderId", deleteFolder);
router.put("/:folderId/files", addFileToFolder);
router.delete("/:folderId/files", deleteFileFromFolder);
router.get("/user/:userId", getFoldersByUserId);

export default router;
