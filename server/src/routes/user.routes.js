import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getUserById,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", protect, restrictTo("ADMIN"), getAllUsers);

// ⚠️ Static routes MUST come before dynamic /:id routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

router.get("/:id", protect, getUserById);
router.delete("/:id", deleteUser);

export default router;
