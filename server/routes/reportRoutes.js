import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  updateMyReport,
  deleteMyReport,
  deleteAnyReport,
} from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

const uploadDir = "uploads/reports";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `report-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype.toLowerCase());

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WEBP files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", protect, upload.single("photo"), createReport);
router.get("/my-reports", protect, getMyReports);
router.put("/my-reports/:id", protect, upload.single("photo"), updateMyReport);
router.delete("/my-reports/:id", protect, deleteMyReport);

router.get("/", protect, authorizeRoles("operator"), getAllReports);
router.put("/:id", protect, authorizeRoles("operator"), updateReportStatus);
router.delete("/:id", protect, authorizeRoles("operator"), deleteAnyReport);

export default router;