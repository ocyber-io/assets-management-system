import bcrypt from "bcryptjs";
import User, { IUser } from "../models/userSchema"; // Assume IUser is exported from userSchema
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      // Add other environment variables as needed
    }
  }
}

const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || "default_secret"; // Provide a default or handle it appropriately
  return jwt.sign(
    {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      googleId: user.googleId,
    },
    secret,
    { expiresIn: "30d" }
  );
};

const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists, Please choose a different email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = generateToken(result);
    return res
      .status(201)
      .json({ message: "Signup successful", userId: result._id, token });
  } catch (error) {
    return res.status(500).json({ message: "Error creating the user" });
  }
};

const googleSignUp = async (req: Request, res: Response): Promise<Response> => {
  const { email, given_name, family_name, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstname: given_name,
        lastname: family_name,
        email,
        googleId,
      });
    }
    const token = generateToken(user);
    return res
      .status(201)
      .json({ message: "Login successful", userId: user._id, token });
  } catch (error) {
    return res.status(500).json({ message: "Error in Google authentication" });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email or Password is incorrect" });
    }

    const isPasswordCorrect =
      user.password && (await bcrypt.compare(password, user.password));
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    const token = generateToken(user);
    return res
      .status(200)
      .json({ message: "Login successful", userId: user._id, token });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in" });
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle password updates specially
    if (updates.password && updates.currentPassword) {
      if (!user.password) {
        return res
          .status(400)
          .json({ message: "Password update not allowed for this user" });
      }
      const isMatch = await bcrypt.compare(
        updates.currentPassword,
        user.password
      );
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updates.password, salt);
      updates.password = hashedPassword;
    } else if (updates.password) {
      return res.status(400).json({
        message: "Current password must be provided to update password",
      });
    }

    // Apply updates to the user object
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User update failed" });
    }

    const token = generateToken(updatedUser);

    return res.status(200).json({
      message: "User updated successfully",
      userId: updatedUser._id,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating the user" });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting the user" });
  }
};

export { signUp, googleSignUp, login, getAllUsers, updateUser, deleteUser };
