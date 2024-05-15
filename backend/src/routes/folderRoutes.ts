import { Router } from "express";
import {
  addFolder,
  deleteFolder,
  addFileToFolder,
  deleteFileFromFolder,
  getFoldersByUserId,
} from "../controllers/folderController";

const router = Router();

router.post("/", addFolder);
router.delete("/:folderId", deleteFolder);
router.put("/:folderId/files", addFileToFolder);
router.delete("/:folderId/files", deleteFileFromFolder);
router.get("/user/:userId", getFoldersByUserId);

export default router;
