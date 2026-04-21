import User from "../models/User.js";
import Report from "../models/Report.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["active", "suspended", "banned"];
    if (!allowedStatuses.includes(String(status).toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = String(status).toLowerCase();
    await user.save();

    if (user.status === "suspended" || user.status === "banned") {
      await Report.deleteMany({
        type: "user",
        reportedUser: user._id,
      });
    }

    res.json({
      message: `User has been ${user.status} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["user", "admin", "operator"];
    if (!allowedRoles.includes(String(role).toLowerCase())) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = String(role).toLowerCase();
    await user.save();

    res.json({
      message: `User role updated to ${user.role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};