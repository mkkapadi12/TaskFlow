import { Router } from 'express';

import {
  addProjectMember,
  archiveProject,
  createProject,
  getAllProjects,
  getMembers,
  getMyProjects,
  getProject,
  getProjectsByOwner,
  permanentDeleteProject,
  removeMember,
  restoreProject,
  updateMemberRole,
  updateProject,
} from '../controllers/project.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
const router = Router();

// ── Project CRUD ──────────────────────────────────────────────

// Get all projects (admin only)
router.get('/', protect, restrictTo('ADMIN'), getAllProjects);

// Get projects the logged-in user belongs to
router.get('/my', protect, getMyProjects);

// Get projects by owner (admin only)
router.get('/owner/:ownerId', protect, restrictTo('ADMIN'), getProjectsByOwner);

// Create project
router.post('/create', protect, restrictTo('ADMIN'), createProject);

// Get single project details (members + tasks)
router.get('/:projectId', protect, getProject);

// Update project
router.put('/:projectId', protect, updateProject);

// Archive project (soft-delete)
router.delete('/:projectId', protect, archiveProject);

// Restore archived project
router.patch('/:projectId/restore', protect, restoreProject);

// Permanently delete project (irreversible)
router.delete('/:projectId/permanent', protect, permanentDeleteProject);

// ── Members ───────────────────────────────────────────────────

// Get members of a project
router.get('/:projectId/members', protect, getMembers);

// Add member to project
router.post(
  '/:projectId/add-member',
  protect,
  restrictTo('ADMIN'),
  addProjectMember
);

// Update member role
router.patch('/:projectId/member/:userId', protect, updateMemberRole);

// Remove member
router.delete('/:projectId/member/:userId', protect, removeMember);

export default router;
