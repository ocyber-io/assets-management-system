import { Request, Response } from "express";
import upload from "../utils/upload";
import FileModel from "../models/fileSchema";
import User from "../models/userSchema";
import { formatFileSize, sizeToBytes } from "../utils/helpers";
import path from "path";
import fs from "fs";
import FolderModel from "../models/folderSchema";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

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
      if (file.isFavorite) {
        file.isFavorite = false;
      }
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

      // Remove the file from its folder
      const objectId = new mongoose.Types.ObjectId(fileId);
      const result = await FolderModel.updateOne(
        { files: objectId },
        { $pull: { files: objectId } }
      );

      // Check if the update was successful
      const updatedFolder = await FolderModel.findOne({ files: objectId });
      if (updatedFolder) {
        console.error("Failed to remove file from folder files array.");
      } else {
        console.log("File successfully removed from folder files array.");
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
//Controller for Deleting multiple files
//---------------------------------------------------------------
export const deleteMultipleFiles = async (req: Request, res: Response) => {
  const { fileIds } = req.body; // Expect an array of file IDs in the request body

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return res.status(400).send({ message: "No file IDs provided." });
  }

  try {
    const deletionPromises = fileIds.map(async (fileId) => {
      const file = await FileModel.findById(fileId);
      if (!file) {
        return { fileId, status: "not found" };
      }

      // Mark the file as deleted if not already marked
      if (!file.isDeleted) {
        if (file.isFavorite) {
          file.isFavorite = false;
        }
        file.isDeleted = true;
        await file.save();
        return { fileId, status: "marked as deleted" };
      }

      // Ensure that the file has an owner before attempting to delete
      if (!file.owner) {
        return { fileId, status: "owner undefined" };
      }

      // Construct the file path using the owner ID
      const filePath = path.resolve(
        __dirname,
        "../../../frontend/public/uploads",
        file.owner.toString(), // Convert ObjectId to string
        file.name
      );

      return new Promise<{ fileId: string; status: string; error?: string }>(
        (resolve, reject) => {
          fs.unlink(filePath, async (err) => {
            if (err) {
              console.error("Failed to delete the physical file:", err);
              return resolve({
                fileId,
                status: "error",
                error: "Failed to delete the physical file.",
              });
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
            resolve({ fileId, status: "deleted" });
          });
        }
      );
    });

    const results = await Promise.allSettled(deletionPromises);

    // Create a response summary
    const summary = results.map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return { fileId: "", status: "error", error: result.reason.message };
      }
    });

    res
      .status(200)
      .send({ message: "Files deletion process completed.", summary });
  } catch (err) {
    console.error("Error deleting multiple files:", err);
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

//---------------------------------------------------------------
// Controller for Disabling Multiple Files
//---------------------------------------------------------------
export const disableMultipleFiles = async (req: Request, res: Response) => {
  const { fileIds } = req.body;

  try {
    // Find all files with the given fileIds
    const files = await FileModel.find({ _id: { $in: fileIds } });
    if (!files || files.length === 0) {
      return res
        .status(404)
        .send({ message: "No files found with the provided IDs." });
    }

    // Disable each file
    const disablePromises = files.map(async (file) => {
      // Skip if the file is already disabled
      if (file.isDisabled) {
        return { fileId: file._id, status: "already disabled" };
      }

      // Disable the file by setting isDisabled to true
      file.isDisabled = true;
      await file.save();
      return { fileId: file._id, status: "disabled" };
    });

    const results = await Promise.all(disablePromises);

    res.status(200).send({
      message: "Disabling process completed.",
      results,
    });
  } catch (err) {
    console.error("Error disabling multiple files:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

//---------------------------------------------------------------
//Controller for Replacing the file
//---------------------------------------------------------------
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

//---------------------------------------------------------------
//Controller for Restoring the file
//---------------------------------------------------------------
export const restoreFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    if (!file.isDeleted) {
      return res
        .status(400)
        .send({ message: "File is not marked as deleted." });
    }

    // Restore the file by setting isDeleted to false
    file.isDeleted = false;
    await file.save();

    // Update user's storage information
    const user = await User.findById(file.owner);
    if (user) {
      const fileSizeInBytes = sizeToBytes(file.size);
      user.usedStorage += fileSizeInBytes;
      user.remainingStorage = 107374182400 - user.usedStorage; // Assuming total storage is a constant
      await user.save();
    }

    res.status(200).send({ message: "File restored successfully.", file });
  } catch (err) {
    console.error("Error restoring file:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

//---------------------------------------------------------------
// Controller for Restoring Multiple Files
//---------------------------------------------------------------
export const restoreMultipleFiles = async (req: Request, res: Response) => {
  const { fileIds } = req.body;

  try {
    // Find all files with the given fileIds
    const files = await FileModel.find({ _id: { $in: fileIds } });
    if (!files || files.length === 0) {
      return res
        .status(404)
        .send({ message: "No files found with the provided IDs." });
    }

    // Restore each file
    const restorationPromises = files.map(async (file) => {
      // Skip if the file is already restored
      if (!file.isDeleted) {
        return { fileId: file._id, status: "already restored" };
      }

      // Restore the file by setting isDeleted to false
      file.isDeleted = false;
      await file.save();
      return { fileId: file._id, status: "restored" };
    });

    const results = await Promise.all(restorationPromises);

    res.status(200).send({
      message: "Restoration process completed.",
      results,
    });
  } catch (err) {
    console.error("Error restoring multiple files:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

//---------------------------------------------------------------
//Controller for Adding or removing the file from Favorites
//---------------------------------------------------------------
export const toggleFileFavorite = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    // Toggle the isFavorite property
    file.isFavorite = !file.isFavorite;
    await file.save();

    res.status(200).send({
      message: `File has been ${
        file.isFavorite ? "favorited" : "unfavorited"
      }.`,
      file,
    });
  } catch (err) {
    console.error("Error toggling file favorite status:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

//---------------------------------------------------------------
//Controller for Toggling Multiple Files to Favorites
//---------------------------------------------------------------
export const toggleMultipleFilesFavorite = async (
  req: Request,
  res: Response
) => {
  const { fileIds } = req.body;

  try {
    // Find all files with the given fileIds
    const files = await FileModel.find({ _id: { $in: fileIds } });
    if (!files || files.length === 0) {
      return res
        .status(404)
        .send({ message: "No files found with the provided IDs." });
    }

    // Toggle the isFavorite property for each file
    for (const file of files) {
      file.isFavorite = !file.isFavorite;
      await file.save();
    }

    res.status(200).send({
      message: `Toggled ${files.length} files to ${
        files[0].isFavorite ? "favorited" : "unfavorited"
      }.`,
      files,
    });
  } catch (err) {
    console.error("Error toggling multiple files favorite status:", err);
    res.status(500).send({ message: "Internal server error." });
  }
};

//---------------------------------------------------------------
//Controller for Sharing a file
//---------------------------------------------------------------
export const sendFileByEmail = async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const { email, message } = req.body;

  try {
    // Find the file by fileId
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    const admin = "cute.arro@outlook.com";
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Outlook",
      auth: {
        user: admin,
        pass: "Love14321",
      },
    });

    // Compose email message
    const mailOptions = {
      from: admin,
      to: email,
      subject: "File Sharing",
      text: `${admin} shared a file with you: \n\n ${message}\n\nLink: ${file.fullLink}\n\nFile size: ${file.size}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({ message: "Error sending email." });
      }
      return res.status(200).send({ message: "Email sent successfully." });
    });
  } catch (error) {
    console.error("Error sending file by email:", error);
    return res.status(500).send({ message: "Internal server error." });
  }
};
