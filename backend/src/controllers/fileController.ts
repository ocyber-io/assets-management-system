import { Request, Response } from "express";
import upload from "../utils/upload";
import FileModel from "../models/fileSchema";
import User from "../models/userSchema";
import { formatFileSize, sizeToBytes } from "../utils/helpers";
import path from "path";
import fs from "fs";

//---------------------------------------------------------------
//Controller for Adding a file
//---------------------------------------------------------------
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

//---------------------------------------------------------------
//Controller for Getting user's files
//---------------------------------------------------------------
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

//---------------------------------------------------------------
//Controller for Renaming a file
//---------------------------------------------------------------
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

//---------------------------------------------------------------
//Controller for Deleting a file
//---------------------------------------------------------------
export const deleteFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    // If the file is not already marked as deleted, mark it as deleted
    if (!file.isDeleted) {
      file.isDeleted = true;
      await file.save();
      return res.status(200).send({ message: "File marked as deleted." });
    }

    // Ensure that the file has an owner before attempting to delete
    if (!file.owner) {
      return res.status(400).send({ message: "File owner is undefined." });
    }

    // Construct the file path using the owner ID
    const filePath = path.resolve(
      __dirname,
      "../../../frontend/public/uploads",
      file.owner.toString(), // Convert ObjectId to string
      file.name
    );

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

//---------------------------------------------------------------
//Controller for Disabling or Enabling the file
//---------------------------------------------------------------
export const toggleFileDisable = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    // Toggle the isDisabled property
    file.isDisabled = !file.isDisabled;
    await file.save();

    res.status(200).send({
      message: `File has been ${file.isDisabled ? "disabled" : "enabled"}.`,
      file,
    });
  } catch (err) {
    console.error("Error toggling file disable status:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

export const replaceFile = async (req: Request, res: Response) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).send({ message: error.message });
    }
    if (!req.file) {
      return res.status(400).send({ message: "No file selected!" });
    }

    const fileId = req.params.fileId;
    const { userId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const file = await FileModel.findById(fileId);
      if (!file) {
        return res.status(404).send({ message: "File not found" });
      }

      const userDir = path.join(
        __dirname,
        "../../../frontend/public/uploads",
        userId
      );

      // Compute the new file path with the new extension
      const newExtension = path.extname(req.file.originalname);
      const newFileName =
        path.basename(file.name, path.extname(file.name)) + newExtension;
      const newFilePath = path.join(userDir, newFileName);

      // Remove the old file
      fs.unlink(path.join(userDir, file.name), async (err) => {
        if (err) {
          console.error("Failed to delete the previous file:", err);
          return res
            .status(500)
            .send({ message: "Failed to delete the previous file." });
        }

        // Asserting that req.file exists
        const uploadedFile = req.file!;

        // Rename the new file to replace the old one
        fs.rename(uploadedFile.path, newFilePath, async (err) => {
          if (err) {
            console.error("Failed to replace the file:", err);
            return res
              .status(500)
              .send({ message: "Failed to replace the file." });
          }

          // Update file details and save
          const baseLink = file.link.substring(0, file.link.lastIndexOf("."));
          const newLink = `${baseLink}${newExtension}`;
          const baseFullLink = file.fullLink.substring(
            0,
            file.fullLink.lastIndexOf(".")
          );
          const newFullLink = `${baseFullLink}${newExtension}`;

          file.originalName = uploadedFile.originalname;
          file.name = newFileName;
          file.size = formatFileSize(uploadedFile.size);
          file.type =
            uploadedFile.mimetype === "application/octet-stream"
              ? uploadedFile.mimetype.replace("octet-stream", "jpeg")
              : uploadedFile.mimetype;
          file.description = req.body.description || file.description;
          file.tags = req.body.tags ? req.body.tags.split(",") : file.tags;
          file.link = newLink;
          file.fullLink = newFullLink;

          await file.save();

          res.status(200).send(file);
        });
      });
    } catch (err: any) {
      res.status(500).send({ message: err.message });
    }
  });
};
