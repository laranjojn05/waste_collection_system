import express from "express";
import { getAllUsers, updateUserStatus } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin", "operator"), getAllUsers);
router.put("/:id/status", protect, authorizeRoles("admin"), updateUserStatus);

export default router;