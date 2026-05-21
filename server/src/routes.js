import { Router } from 'express';

import authRoutes from './routes/auth.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications/settings', notificationRoutes);

export default router;
