import mongoose, { Schema, Document } from "mongoose";

export interface IFolder extends Document {
  folderName: string;
  folderColor: string;
  userId: mongoose.Types.ObjectId;
  files: mongoose.Types.ObjectId[];
  isDeleted: boolean;
}

const folderSchema: Schema<IFolder> = new Schema(
  {
    folderName: { type: String, required: true },
    folderColor: { type: String, default: "#FFFFFF" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const FolderModel = mongoose.model<IFolder>("Folder", folderSchema);

export default FolderModel;
