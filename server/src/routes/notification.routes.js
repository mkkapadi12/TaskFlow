import { Router } from 'express';

import {
  getSettings,
  updateSettings,
} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', protect, getSettings);
router.patch('/', protect, updateSettings);

export default router;
