import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js"; // 👈 IMPORTANT

const router = express.Router();

router.get("/", protect, getAnnouncements);

router.post("/", protect, authorizeRoles("admin"), createAnnouncement);
router.put("/:id", protect, authorizeRoles("admin"), updateAnnouncement);
router.delete("/:id", protect, authorizeRoles("admin"), deleteAnnouncement);

export default router;