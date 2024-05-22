import { Request, Response } from "express";
import FileModel from "../models/fileSchema";
import FolderModel from "../models/folderSchema";
import mongoose from "mongoose";
import User from "../models/userSchema";
import path from "path";
import { sizeToBytes } from "../utils/helpers";
import fs from "fs";

//================================================================
// Add new Folders
//================================================================
export const addFolder = async (req: Request, res: Response) => {
  try {
    const { folderName, folderColor, userId } = req.body;

    const newFolder = new FolderModel({
      folderName,
      folderColor,
      userId,
      files: [],
    });

    await newFolder.save();

    res.status(201).json(newFolder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
// Delete a folder
//================================================================
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;

    const folder = await FolderModel.findById(folderId).populate("files");
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (folder.isDeleted) {
      // If already deleted, remove files from the database and physically
      for (const file of folder.files) {
        await deleteFileById(file._id.toString());
      }
      await FolderModel.findByIdAndDelete(folderId);
      return res
        .status(200)
        .json({ message: "Folder and its files deleted successfully" });
    } else {
      // If not deleted, mark the folder and its files as deleted
      folder.isDeleted = true;
      await folder.save();

      for (const file of folder.files) {
        await markFileAsDeleted(file._id.toString());
      }
      return res
        .status(200)
        .json({ message: "Folder and its files marked as deleted" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
// Delete multiple folders
//================================================================
export const deleteMultipleFolders = async (req: Request, res: Response) => {
  try {
    const { folderIds } = req.body;

    // Iterate over each folder ID and perform deletion
    for (const folderId of folderIds) {
      const folder = await FolderModel.findById(folderId).populate("files");
      if (!folder) {
        console.error(`Folder with ID ${folderId} not found`);
        continue; // Move to the next folder if current folder is not found
      }

      // Check if the folder is already marked as deleted
      if (folder.isDeleted) {
        // If already deleted, remove files from the database and physically
        for (const file of folder.files) {
          await deleteFileById(file._id.toString());
        }
        await FolderModel.findByIdAndDelete(folderId);
        console.log(
          `Folder with ID ${folderId} and its files deleted successfully`
        );
      } else {
        // If not deleted, mark the folder and its files as deleted
        folder.isDeleted = true;
        await folder.save();

        // Mark all files in the folder as deleted
        for (const file of folder.files) {
          await markFileAsDeleted(file._id.toString());
        }
        console.log(
          `Folder with ID ${folderId} and its files marked as deleted`
        );
      }
    }

    res.status(200).json({
      message:
        "Folders and their files deleted or marked as deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
//helper functions for deleting
//================================================================
const markFileAsDeleted = async (fileId: string) => {
  const file = await FileModel.findById(fileId);
  if (file) {
    if (file.isFavorite) {
      file.isFavorite = false;
    }
    file.isDeleted = true;
    await file.save();
  }
};
const markFileAsUndeleted = async (fileId: string) => {
  const file = await FileModel.findById(fileId);
  if (file) {
    if (file.isFavorite) {
      file.isFavorite = false;
    }
    file.isDeleted = false;
    await file.save();
  }
};

const deleteFileById = async (fileId: string) => {
  const file = await FileModel.findById(fileId);
  if (file) {
    if (!file.owner) {
      console.error("File owner is undefined, skipping file:", fileId);
      return;
    }

    const filePath = path.resolve(
      __dirname,
      "../../../frontend/public/uploads",
      file.owner.toString(), // Convert ObjectId to string
      file.name
    );

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Failed to delete the physical file:", err);
      } else {
        // Update user storage usage
        const user = await User.findById(file.owner);
        if (user) {
          const fileSizeInBytes = sizeToBytes(file.size);
          user.usedStorage -= fileSizeInBytes;
          user.remainingStorage = 107374182400 - user.usedStorage; // Assuming total storage is a constant
          await user.save();
        }

        // Delete the file record
        await FileModel.findByIdAndDelete(fileId);
      }
    });
  }
};
//================================================================
//helper functions for deleint ends here
//================================================================

// Add a file to a folder
export const addFileToFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const { fileId } = req.body;

    const folder = await FolderModel.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the file is already in the folder
    if (folder.files.includes(fileId)) {
      return res
        .status(400)
        .json({ message: "File already exists in the folder" });
    }

    folder.files.push(fileId);
    await folder.save();

    res.status(200).json(folder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
// Delete a file from a folder
//================================================================
export const deleteFileFromFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const { fileId } = req.body;

    const folder = await FolderModel.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    folder.files = folder.files.filter((file) => !file.equals(fileId));
    await folder.save();

    res.status(200).json(folder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
// Get folders by userId
//================================================================
export const getFoldersByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Find all folders for the given user and populate the 'files' field for each folder
    const folders = await FolderModel.find({ userId }).populate("files");

    if (!folders) {
      return res
        .status(404)
        .json({ message: "No folders found for this user" });
    }

    res.status(200).json(folders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
// Update a folder
//================================================================
export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const updates = req.body;

    const folder = await FolderModel.findByIdAndUpdate(folderId, updates, {
      new: true,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
//get folder details by ID
//================================================================
export const getFolderById = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;

    const folder = await FolderModel.findById(folderId).populate("files");
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
// Restore a folder
//================================================================
export const restoreFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;

    const folder = await FolderModel.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (!folder.isDeleted) {
      return res
        .status(400)
        .json({ message: "Folder is not marked as deleted" });
    }

    folder.isDeleted = false;

    for (const file of folder.files) {
      await markFileAsUndeleted(file._id.toString());
    }
    await folder.save();

    res.status(200).json({ message: "Folder restored successfully", folder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
// restore multiple folders
//================================================================
export const restoreMultipleFolders = async (req: Request, res: Response) => {
  try {
    // Get an array of folder IDs from the request body
    const { folderIds } = req.body;

    // Find all folders with the provided IDs
    const folders = await FolderModel.find({ _id: { $in: folderIds } });

    // Check if all folders exist
    if (folders.length !== folderIds.length) {
      return res.status(404).json({ message: "One or more folders not found" });
    }

    // Iterate over each folder
    for (const folder of folders) {
      // Check if the folder is already restored
      if (!folder.isDeleted) {
        console.log(`Folder ${folder._id} is not marked as deleted`);
        continue; // Move to the next folder
      }

      // Restore the folder by setting isDeleted to false
      folder.isDeleted = false;

      // Iterate over each file in the folder and mark it as undeleted
      for (const fileId of folder.files) {
        await markFileAsUndeleted(fileId.toString());
      }

      // Save the changes to the folder
      await folder.save();
    }

    res.status(200).json({ message: "Folders restored successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
