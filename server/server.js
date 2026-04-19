import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: serve uploaded images
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/announcements", announcementRoutes);

app.get("/", (req, res) => {
  res.send("Waste Collection and Reporting API is running...");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});