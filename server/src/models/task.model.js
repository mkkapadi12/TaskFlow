import callProcedure from '../config/callProcedure.js';
import { AppError } from '../middlewares/error.middleware.js';
import {
  getMembership,
  requireManager,
  requireMembership,
  requireOwner,
} from '../utils/requireRole.js';
import CommentModel from './comment.model.js';

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
const ASSIGNEE_STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW'];

const ensureAssigneeIsMember = async (projectId, assigneeId) => {
  if (assigneeId === null || assigneeId === undefined) return;
  const membership = await getMembership(projectId, assigneeId);
  if (!membership) {
    throw new AppError('Assignee must be a project member', 400);
  }
};

const loadTask = async (taskId) => {
  const [rows] = await callProcedure('sp_GetTaskById', [taskId]);
  if (!rows[0]) {
    throw new AppError('Task not found', 404);
  }
  return rows[0];
};

const TaskModel = {
  // Create a task — only OWNER/ADMIN of the project can assign work.
  create: async (creatorId, body) => {
    const {
      title,
      description,
      status,
      priority,
      deadline,
      projectId,
      assigneeId,
    } = body;

    await requireManager(projectId, creatorId);
    await ensureAssigneeIsMember(projectId, assigneeId);

    const [task] = await callProcedure('sp_CreateTask', [
      title,
      description ?? null,
      status ?? null,
      priority ?? null,
      deadline ?? null,
      projectId,
      assigneeId ?? null,
      creatorId,
    ]);
    return task[0];
  },

  // Get tasks for a project (requires membership, optional status filter)
  getByProject: async (projectId, userId, status) => {
    await requireMembership(projectId, userId);

    const [tasks] = await callProcedure('sp_GetTasksByProject', [
      projectId,
      status ?? null,
    ]);
    return tasks;
  },

  // Get tasks assigned to the logged-in user
  getMyTasks: async (userId) => {
    const [tasks] = await callProcedure('sp_GetTasksByAssignee', [userId]);
    return tasks;
  },

  // Get a single task by ID (requires membership on the task's project)
  getById: async (taskId, userId) => {
    const task = await loadTask(taskId);
    await requireMembership(task.projectId, userId);
    return task;
  },

  // Update task fields (NOT status) — OWNER/ADMIN only.
  update: async (taskId, userId, body) => {
    const existing = await loadTask(taskId);
    await requireManager(existing.projectId, userId);

    const { title, description, priority, deadline, assigneeId } = body;

    if (assigneeId !== undefined) {
      await ensureAssigneeIsMember(existing.projectId, assigneeId);
    }

    const [task] = await callProcedure('sp_UpdateTask', [
      taskId,
      title ?? null,
      description ?? null,
      null, // status — managed via updateStatus / verify
      priority ?? null,
      deadline ?? null,
      assigneeId ?? null,
    ]);
    return task[0];
  },

  // Change task status — assignee OR project manager can move through
  // TODO ↔ IN_PROGRESS ↔ IN_REVIEW. DONE is reachable only via verify().
  updateStatus: async (taskId, userId, status) => {
    if (!TASK_STATUSES.includes(status)) {
      throw new AppError('Invalid status', 400);
    }
    if (status === 'DONE') {
      throw new AppError('Use the verify endpoint to mark a task as DONE', 400);
    }

    const existing = await loadTask(taskId);
    const membership = await requireMembership(existing.projectId, userId);

    const isAssignee = existing.assigneeId === userId;
    const isManager =
      membership.role === 'OWNER' || membership.role === 'ADMIN';

    if (!isAssignee && !isManager) {
      throw new AppError(
        'Only the assignee or a project manager can change task status',
        403
      );
    }

    if (isAssignee && !isManager && !ASSIGNEE_STATUSES.includes(status)) {
      throw new AppError(
        'Assignees cannot move tasks out of the active workflow',
        403
      );
    }

    if (existing.status === 'DONE' && membership.role !== 'OWNER') {
      throw new AppError(
        'Only the project owner can reopen a completed task',
        403
      );
    }

    const [rows] = await callProcedure('sp_UpdateTask', [
      taskId,
      null,
      null,
      status,
      null,
      null,
      null,
    ]);

    if (existing.status !== status) {
      try {
        await CommentModel.logActivity(
          taskId,
          userId,
          `changed status from ${existing.status} to ${status}`
        );
      } catch (err) {
        console.error('Failed to log status change activity:', err);
      }
    }

    return rows[0];
  },

  // Verify a task that's in IN_REVIEW — owner approves (→ DONE) or
  // rejects (→ IN_PROGRESS). SP enforces the IN_REVIEW precondition.
  verify: async (taskId, userId, approve) => {
    const existing = await loadTask(taskId);
    await requireOwner(existing.projectId, userId);

    const [rows] = await callProcedure('sp_VerifyTask', [
      taskId,
      approve ? 1 : 0,
    ]);

    try {
      const action = approve
        ? 'approved task and marked it as DONE'
        : 'rejected task and sent it back to IN_PROGRESS';
      await CommentModel.logActivity(taskId, userId, action);
    } catch (err) {
      console.error('Failed to log verification activity:', err);
    }

    return rows[0];
  },

  // Delete a task (creator, or project OWNER)
  delete: async (taskId, userId) => {
    const task = await loadTask(taskId);

    if (task.creatorId !== userId) {
      await requireOwner(task.projectId, userId);
    }

    const [result] = await callProcedure('sp_DeleteTask', [taskId]);
    if (result[0]?.deletedCount === 0) {
      throw new AppError('Failed to delete task', 500);
    }
    return { message: 'Task deleted successfully' };
  },

  // Get overdue tasks for the logged-in user
  getOverdue: async (userId) => {
    const [tasks] = await callProcedure('sp_GetOverdueTasks', [userId]);
    return tasks;
  },
};

export default TaskModel;
