import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    barangay: {
      type: String,
      required: true,
    },
    collectionDate: {
      type: Date,
      required: true,
    },
    wasteType: {
      type: String,
      enum: ["Biodegradable", "Non-Biodegradable", "Recyclable", "Special Waste"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;