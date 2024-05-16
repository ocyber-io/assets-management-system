import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  _id?: mongoose.Types.ObjectId;
  name: string;
  originalName: string;
  image?: string;
  type?: string;
  location?: string;
  owner?: mongoose.Types.ObjectId;
  downloadPermission?: boolean;
  link: string;
  fullLink: string;
  size: string;
  tags: string[];
  description?: string;
  isDisabled?: boolean;
  isDeleted?: boolean;
  isFavorite?: boolean;
}

const fileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    originalName: { type: String },
    type: { type: String },
    location: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloadPermission: { type: Boolean, default: true },
    link: { type: String, required: true },
    fullLink: { type: String },
    size: { type: String, required: true },
    tags: { type: [String], required: true },
    description: { type: String },
    isDisabled: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model<IFile>("File", fileSchema);

export default FileModel;
