import { Request, Response } from "express";
import upload from "../utils/upload";
import FileModel from "../models/fileSchema";
import User from "../models/userSchema";
import { formatFileSize } from "../utils/helpers";

export const addFile = (req: Request, res: Response) => {
  upload(req, res, async (error) => {
    if (error) {
      res.status(500).send({ message: error });
    } else {
      if (!req.file) {
        res.status(400).send({ message: "No file selected!" });
      } else {
        const { tags, description, userId } = req.body;
        const fileSize = req.file.size;

        try {
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }

          user.usedStorage += fileSize;
          user.remainingStorage = 107374182400 - user.usedStorage;

          await user.save();

          const relativeLink = `/uploads/${req.file.filename}`;

          const newFile = new FileModel({
            name: req.file.filename,
            link: relativeLink,
            size: formatFileSize(fileSize),
            tags: tags ? tags.split(",") : [],
            description: description || "",
            owner: userId,
            storageUsed: `${formatFileSize(user.usedStorage)}`,
          });

          await newFile.save();
          res.status(201).send(newFile);
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
