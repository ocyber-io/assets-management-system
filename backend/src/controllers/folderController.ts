import { Request, Response } from "express";
import mongoose from "mongoose";
import FolderModel, { IFolder } from "../models/folderSchema";
import FileModel from "../models/fileSchema";

// Add a new folder
export const addFolder = async (req: Request, res: Response) => {
  try {
    const { folderName, folderColor, userId } = req.body;

    const newFolder = new FolderModel({
      folderName,
      folderColor,
      userId,
      files: [],
    });

    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a folder
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;

    const deletedFolder = await FolderModel.findByIdAndDelete(folderId);
    if (!deletedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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

// Delete a file from a folder
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
