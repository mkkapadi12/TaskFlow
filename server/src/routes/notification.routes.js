import { Router } from 'express';

import {
  deleteNotification,
  getNotifications,
  getSettings,
  markAllRead,
  markRead,
  updateSettings,
} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Feed endpoints
router.get('/feed', protect, getNotifications);
router.patch('/:id/read', protect, markRead);
router.patch('/read-all', protect, markAllRead);
router.delete('/:id', protect, deleteNotification);

// Settings endpoints (prefixed since base route changes from /notifications/settings to /notifications)
router.get('/settings', protect, getSettings);
router.patch('/settings', protect, updateSettings);

export default router;
