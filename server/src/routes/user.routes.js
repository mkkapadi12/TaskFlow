import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getUserById,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.get("/profile", protect, getProfile);

// // update user
router.put("/profile", protect, upload.single("avatar"), updateProfile);

// // delete user
router.delete("/:id", deleteUser);

export default router;
