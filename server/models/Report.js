import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueType: {
      type: String,
      enum: [
        "Missed Collection",
        "Illegal Dumping",
        "Overflowing Bin",
        "Uncollected Waste",
        "Other",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
status: {
  type: String,
  enum: ["Pending", "Approved", "Rejected", "Resolved"],
  default: "Pending",
},
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;