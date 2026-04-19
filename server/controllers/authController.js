import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password, barangay } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      barangay,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      barangay: user.barangay,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "suspended") {
      return res
        .status(403)
        .json({ message: "Your account is suspended. Please contact admin." });
    }

    if (user.status === "banned") {
      return res
        .status(403)
        .json({ message: "Your account is banned. Please contact admin." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      barangay: user.barangay,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.barangay = req.body.barangay || user.barangay;

    if (req.body.password && req.body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      barangay: updatedUser.barangay,
      role: updatedUser.role,
      status: updatedUser.status,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};