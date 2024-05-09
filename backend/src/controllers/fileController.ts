import { Request, Response } from "express";
import upload from "../utils/upload";
import FileModel from "../models/fileSchema";
import User from "../models/userSchema";
import { formatFileSize, sizeToBytes } from "../utils/helpers";
import path from "path";
import fs from "fs";

export const addFile = async (req: Request, res: Response) => {
  upload(req, res, async (error) => {
    if (error) {
      res.status(500).send({ message: error.message });
    } else {
      if (!req.file) {
        res.status(400).send({ message: "No file selected!" });
      } else {
        const { tags, description, userId } = req.body;
        const fileSize = req.file.size;
        const baseURL = process.env.BASE_URL;

        try {
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }

          const userDir = path.join(
            __dirname,
            "../../../frontend/public/uploads",
            userId
          );
          fs.mkdirSync(userDir, { recursive: true }); // Ensure user directory exists

          const oldPath = req.file.path;
          const newPath = path.join(userDir, req.file.filename);

          fs.rename(oldPath, newPath, async (err) => {
            if (err) throw err;

            if (!req.file) {
              return res.status(400).send({ message: "No file selected!" });
            }

            const relativeLink = `/uploads/${userId}/${req.file.filename}`;
            const fullLink = `${baseURL}${relativeLink}`;

            const newFile = new FileModel({
              originalName: req.file.originalname,
              name: req.file.filename,
              link: relativeLink,
              fullLink: fullLink,
              size: formatFileSize(fileSize),
              type: req.file.mimetype,
              tags: tags ? tags.split(",") : [],
              description: description || "",
              owner: userId,
              storageUsed: `${formatFileSize(user.usedStorage)}`,
            });

            user.usedStorage += fileSize;
            user.remainingStorage = 107374182400 - user.usedStorage;
            await user.save();
            await newFile.save();
            res.status(201).send(newFile);
          });
        } catch (err: any) {
          res.status(500).send({ message: err.message });
        }
      }
    }
  });
};

export const getUserFiles = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const files = await FileModel.find({ owner: userId });
    res.status(200).send(files);
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
};

// In your fileController.js
export const renameFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const { newOriginalName } = req.body;

  if (!newOriginalName) {
    return res.status(400).send({ message: "New name must be provided." });
  }

  try {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    // Extract the extension from the original filename
    const originalExtension = path.extname(file.originalName);

    // Check if the new name has an extension
    const hasExtension = path.extname(newOriginalName);

    // If new name lacks an extension and the original name had one, append it
    if (!hasExtension && originalExtension) {
      file.originalName = `${newOriginalName}${originalExtension}`;
    } else {
      file.originalName = newOriginalName;
    }

    await file.save();

    res.status(200).send({
      message: "File renamed successfully.",
      file: file,
    });
  } catch (err) {
    console.error("Error updating file name:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    // Construct the file path relative to the backend directory
    const filePath = path.resolve(
      __dirname,
      "../../../frontend/public/uploads",
      file.name
    );

    // Remove the physical file
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Failed to delete the physical file:", err);
        return res
          .status(500)
          .send({ message: "Failed to delete the physical file." });
      }

      // Update user storage usage
      const user = await User.findById(file.owner);
      if (user) {
        const fileSizeInBytes = sizeToBytes(file.size); // Ensure size is converted from string to bytes
        user.usedStorage -= fileSizeInBytes;
        user.remainingStorage = 107374182400 - user.usedStorage; // Assuming total storage is a constant
        await user.save();
      }

      // Delete the file record
      await FileModel.findByIdAndDelete(fileId);
      res.status(200).send({ message: "File deleted successfully." });
    });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};
