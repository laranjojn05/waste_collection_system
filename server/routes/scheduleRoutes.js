import express from "express";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getSchedules);
router.post("/", protect, authorizeRoles("operator"), createSchedule);
router.put("/:id", protect, authorizeRoles("operator"), updateSchedule);
router.delete("/:id", protect, authorizeRoles("operator"), deleteSchedule);

export default router;