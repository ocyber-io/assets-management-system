import mongoose, { Schema, Document } from "mongoose";

// Define the IFolder interface
export interface IFolder extends Document {
  folderName: string;
  folderColor: string;
  userId: mongoose.Types.ObjectId;
  files: mongoose.Types.ObjectId[];
}

// Define the Folder schema
const folderSchema: Schema<IFolder> = new Schema(
  {
    folderName: { type: String, required: true },
    folderColor: { type: String, default: "#FFFFFF" }, // Default color is white
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  },
  {
    timestamps: true,
  }
);

// Create the Folder model
const FolderModel = mongoose.model<IFolder>("Folder", folderSchema);

export default FolderModel;
