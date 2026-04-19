import express from "express";
import {
  signupUser,
  loginUser,
  getMe,
  updateMe,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;