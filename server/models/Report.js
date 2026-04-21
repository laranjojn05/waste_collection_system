import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["waste", "user"],
    required: true,
  },

  // For waste reports
  description: String,
  location: String,
  image: String,


  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reason: String,


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);