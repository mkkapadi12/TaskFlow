import callProcedure from "../config/callProcedure.js";
import { AppError } from "../middlewares/error.middleware.js";
import { requireMembership, requireOwner } from "../utils/requireRole.js";

const TaskModel = {
  // Create a task (requires project membership)
  create: async (creatorId, body) => {
    const { title, description, status, priority, deadline, projectId, assigneeId } = body;

    await requireMembership(projectId, creatorId);

    const [task] = await callProcedure("sp_CreateTask", [
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

    const [tasks] = await callProcedure("sp_GetTasksByProject", [
      projectId,
      status ?? null,
    ]);
    return tasks;
  },

  // Get tasks assigned to the logged-in user
  getMyTasks: async (userId) => {
    const [tasks] = await callProcedure("sp_GetTasksByAssignee", [userId]);
    return tasks;
  },

  // Get a single task by ID (requires membership on the task's project)
  getById: async (taskId, userId) => {
    const [task] = await callProcedure("sp_GetTaskById", [taskId]);

    if (!task[0]) {
      throw new AppError("Task not found", 404);
    }

    // Verify the user is a member of the task's project
    await requireMembership(task[0].projectId, userId);

    return task[0];
  },

  // Update a task (requires membership on the task's project)
  update: async (taskId, userId, body) => {
    // First verify the task exists and user has access
    const [existing] = await callProcedure("sp_GetTaskById", [taskId]);
    if (!existing[0]) {
      throw new AppError("Task not found", 404);
    }

    await requireMembership(existing[0].projectId, userId);

    const { title, description, status, priority, deadline, assigneeId } = body;

    const [task] = await callProcedure("sp_UpdateTask", [
      taskId,
      title ?? null,
      description ?? null,
      status ?? null,
      priority ?? null,
      deadline ?? null,
      assigneeId ?? null,
    ]);
    return task[0];
  },

  // Delete a task (requires OWNER of project or task creator)
  delete: async (taskId, userId) => {
    const [existing] = await callProcedure("sp_GetTaskById", [taskId]);
    if (!existing[0]) {
      throw new AppError("Task not found", 404);
    }

    const task = existing[0];

    // Allow delete if user is the task creator
    if (task.creatorId !== userId) {
      // Otherwise, must be project owner
      await requireOwner(task.projectId, userId);
    }

    const [result] = await callProcedure("sp_DeleteTask", [taskId]);
    if (result[0]?.deletedCount === 0) {
      throw new AppError("Failed to delete task", 500);
    }
    return { message: "Task deleted successfully" };
  },

  // Get overdue tasks for the logged-in user
  getOverdue: async (userId) => {
    const [tasks] = await callProcedure("sp_GetOverdueTasks", [userId]);
    return tasks;
  },
};

export default TaskModel;
