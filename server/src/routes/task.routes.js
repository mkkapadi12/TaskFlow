import { Router } from "express";
import {
  createTask,
  getTasksByProject,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getOverdueTasks,
  updateTaskStatus,
  verifyTask,
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// ── Task CRUD ─────────────────────────────────────────────────

// Create a task in a project (owner/admin only)
router.post("/", protect, createTask);

// Get tasks assigned to the logged-in user
router.get("/my", protect, getMyTasks);

// Get overdue tasks for the logged-in user
router.get("/overdue", protect, getOverdueTasks);

// Get tasks for a project (optional ?status= filter)
router.get("/project/:projectId", protect, getTasksByProject);

// Get a single task by ID
router.get("/:taskId", protect, getTaskById);

// Update task fields (owner/admin only; cannot set status here)
router.put("/:taskId", protect, updateTask);

// Update status (assignee or owner/admin; cannot set DONE here)
router.patch("/:taskId/status", protect, updateTaskStatus);

// Verify task (owner only; approve → DONE, reject → IN_PROGRESS)
router.patch("/:taskId/verify", protect, verifyTask);

// Delete a task
router.delete("/:taskId", protect, deleteTask);

export default router;
