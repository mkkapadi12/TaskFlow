import { Router } from "express";
import { login, register, forgotPassword, resetPassword, changePassword } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import validate from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

// create router
const router = Router();

// register route
router.post("/register", validate(registerSchema), register);

// login route
router.post("/login", validate(loginSchema), login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);

export default router;
