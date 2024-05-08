import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  _id?: mongoose.Types.ObjectId;
  name: string;
  image?: string;
  type?: string;
  location?: string;
  owner?: mongoose.Types.ObjectId;
  downloadPermission?: boolean;
  link: string;
  size: string;
  tags: string[];
  description?: string;
}

const fileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    type: { type: String },
    location: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloadPermission: { type: Boolean, default: false },
    link: { type: String, required: true },
    size: { type: String, required: true },
    tags: { type: [String], required: true },
    description: { type: String },
  },
  {
    timestamps: true, // Enable automatic timestamping
  }
);

// Creating the model from the schema
const FileModel = mongoose.model<IFile>("File", fileSchema);

export default FileModel;
