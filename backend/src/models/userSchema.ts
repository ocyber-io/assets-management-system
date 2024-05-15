import mongoose from "mongoose";

export type IUser = {
  _id?: mongoose.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  totalStorage: string;
  usedStorage: number;
  remainingStorage: number;
  favoriteFiles?: mongoose.Types.ObjectId[];
};

const userSchema = new mongoose.Schema<IUser>({
  firstname: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v: string) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  totalStorage: { type: String, default: "100GB" },
  usedStorage: { type: Number, default: 0 },
  remainingStorage: { type: Number, default: 107374182400 },
  favoriteFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
