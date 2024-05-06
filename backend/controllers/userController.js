import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      googleId: user.googleId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d", // Token expires in 30 days
    }
  );
};

// SignUp Controller
const signUp = async (req, res) => {
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
    res
      .status(201)
      .json({ message: "Signup successful", userId: result._id, token });
  } catch (error) {
    res.status(500).json({ message: "Error creating the user" });
  }
};

const googleSignUp = async (req, res) => {
  const { email, given_name, family_name, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if doesn't exist
      user = await User.create({
        firstname: given_name,
        lastname: family_name,
        email,
        googleId,
      });
    }
    const token = generateToken(user);
    res
      .status(201)
      .json({ message: "Login successful", userId: user._id, token });
  } catch (error) {
    res.status(500).json({ message: "Error in Google authentication" });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email or Password is incorrect",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res
      .status(200)
      .json({ message: "Login successful", userId: user._id, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

// Admin Routes
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating the user" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the user" });
  }
};

export { signUp, googleSignUp, login, getAllUsers, updateUser, deleteUser };
