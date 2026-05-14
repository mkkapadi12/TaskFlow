import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import validate from "../middlewares/validate.middleware.js";

// create router
const router = Router();

// register route
router.post("/register", validate(registerSchema), register);

// login route
router.post("/login", validate(loginSchema), login);

export default router;
