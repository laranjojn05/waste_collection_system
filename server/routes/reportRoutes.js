import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createWasteReport,
  reportUser,
  getWasteReports,
  getUserReports,
  getMyReports,
  updateMyReport,
  deleteMyReport,
  updateReportStatus,
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

router.post(
  "/waste",
  protect,
  authorizeRoles("user"),
  upload.single("image"),
  createWasteReport
);

router.get(
  "/my",
  protect,
  authorizeRoles("user"),
  getMyReports
);

router.put(
  "/my/:id",
  protect,
  authorizeRoles("user"),
  upload.single("image"),
  updateMyReport
);

router.delete(
  "/my/:id",
  protect,
  authorizeRoles("user"),
  deleteMyReport
);

router.get(
  "/waste",
  protect,
  authorizeRoles("operator"),
  getWasteReports
);

router.post(
  "/user",
  protect,
  authorizeRoles("operator"),
  reportUser
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("operator"),
  updateReportStatus
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("operator"),
  deleteAnyReport
);

router.get(
  "/user",
  protect,
  authorizeRoles("admin"),
  getUserReports
);

export default router;