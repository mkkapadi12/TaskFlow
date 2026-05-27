import { Router } from 'express';

import env from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import { checkAndSendReminders } from './services/reminder.service.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications/settings', notificationRoutes);
router.use('/projects/:projectId/documents', documentRoutes);

// Secure GET /cron/reminders route for Vercel Cron
router.get('/cron/reminders', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (
    env.vercel.cron.secret &&
    authHeader !== `Bearer ${env.vercel.cron.secret}`
  ) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    await checkAndSendReminders();
    res.json({ success: true, message: 'Reminders checked and sent.' });
  } catch (err) {
    next(err);
  }
});

export default router;
