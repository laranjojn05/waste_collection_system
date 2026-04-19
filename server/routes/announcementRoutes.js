import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getAnnouncements);
router.post("/", protect, adminOnly, createAnnouncement);
router.put("/:id", protect, adminOnly, updateAnnouncement);
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

export default router;