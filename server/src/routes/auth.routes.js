import { Router } from 'express';

import {
  changePassword,
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema,registerSchema } from '../schema/auth.schema.js';

// create router
const router = Router();

// register route
router.post('/register', validate(registerSchema), register);

// login route
router.post('/login', validate(loginSchema), login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);

export default router;
