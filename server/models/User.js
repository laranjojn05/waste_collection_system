import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "operator"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    barangay: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;