import callProcedure from '../config/callProcedure.js';
import { AppError } from '../middlewares/error.middleware.js';
import { getMembership, requireMembership } from '../utils/requireRole.js';

/**
 * Load a single task row (reused for project-membership checks).
 */
const loadTask = async (taskId) => {
  const [rows] = await callProcedure('sp_GetTaskById', [taskId]);
  if (!rows[0]) {
    throw new AppError('Task not found', 404);
  }
  return rows[0];
};

const CommentModel = {
  /**
   * Add a comment to a task.
   * Any project member can comment.
   */
  create: async (taskId, userId, content) => {
    const task = await loadTask(taskId);
    await requireMembership(task.projectId, userId);

    const [row] = await callProcedure('sp_CreateTaskComment', [
      taskId,
      userId,
      content,
      'COMMENT',
    ]);
    return row[0];
  },

  /**
   * Get all comments (+ activity entries) for a task.
   * Requires project membership.
   */
  getByTask: async (taskId, userId) => {
    const task = await loadTask(taskId);
    await requireMembership(task.projectId, userId);

    const [comments] = await callProcedure('sp_GetTaskComments', [taskId]);
    return comments;
  },

  /**
   * Delete a comment.
   * Author can delete own; OWNER/ADMIN can delete any.
   */
  delete: async (commentId, userId) => {
    const [rows] = await callProcedure('sp_GetTaskCommentById', [commentId]);
    const comment = rows[0];

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Only user-created comments can be deleted (not system activity)
    if (comment.type === 'ACTIVITY') {
      throw new AppError('Activity entries cannot be deleted', 400);
    }

    const task = await loadTask(comment.taskId);

    // Check: is user the author, or a project manager?
    const isAuthor = comment.userId === userId;
    if (!isAuthor) {
      const membership = await getMembership(task.projectId, userId);
      if (
        !membership ||
        (membership.role !== 'OWNER' && membership.role !== 'ADMIN')
      ) {
        throw new AppError(
          'Only the comment author or a project manager can delete this comment',
          403
        );
      }
    }

    const [result] = await callProcedure('sp_DeleteTaskComment', [commentId]);
    if (result[0]?.deletedCount === 0) {
      throw new AppError('Failed to delete comment', 500);
    }
    return { message: 'Comment deleted successfully' };
  },

  /**
   * Log an activity entry on a task.
   * Called internally by task model — no membership check needed
   * (the caller already validated permissions).
   */
  logActivity: async (taskId, userId, content) => {
    const [row] = await callProcedure('sp_CreateTaskActivity', [
      taskId,
      userId,
      content,
    ]);
    return row[0];
  },
};

export default CommentModel;
