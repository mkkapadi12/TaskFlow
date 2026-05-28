import callProcedure from '../config/callProcedure.js';
import { sendToUser } from '../config/socket.js';
import NotificationModel from '../models/notification.model.js';

/**
 * Helper to fetch a task's full info.
 */
const getTaskInfo = async (taskId) => {
  const [rows] = await callProcedure('sp_GetTaskById', [taskId]);
  return rows[0] || null;
};

/**
 * Helper to fetch a project's full info.
 */
const getProjectInfo = async (projectId) => {
  const [rows] = await callProcedure('sp_GetProjectById', [projectId]);
  return rows[0] || null;
};

/**
 * Central notification dispatcher.
 * Fire-and-forget design: completely wrapped in try/catch so it never blocks the main API controller response.
 */
const dispatchNotification = async (type, payload) => {
  try {
    const { actorId, actorName } = payload;
    let recipients = [];
    let title = '';
    let body = '';
    let meta = {
      type,
      actorId,
      actorName,
    };

    switch (type) {
      case 'COMMENT_ADDED': {
        const { taskId, commentPreview } = payload;
        const task = await getTaskInfo(taskId);
        if (!task) return;

        // Notify assignee and creator, except the person commenting
        recipients = [task.assigneeId, task.creatorId];
        title = `New Comment on "${task.title}"`;
        body = `${actorName}: "${commentPreview}"`;
        meta = {
          ...meta,
          taskId,
          projectId: task.projectId,
          projectTitle: task.projectTitle,
          taskTitle: task.title,
        };
        break;
      }

      case 'TASK_ASSIGNED': {
        const { taskId, assigneeId } = payload;
        const task = await getTaskInfo(taskId);
        if (!task) return;

        recipients = [assigneeId];
        title = `Task Assigned: "${task.title}"`;
        body = `${actorName} assigned you this task in project "${task.projectTitle}"`;
        meta = {
          ...meta,
          taskId,
          projectId: task.projectId,
          projectTitle: task.projectTitle,
          taskTitle: task.title,
        };
        break;
      }

      case 'TASK_STATUS_CHANGED': {
        const { taskId, oldStatus, newStatus } = payload;
        const task = await getTaskInfo(taskId);
        if (!task) return;

        // Notify assignee and creator, except the status changer
        recipients = [task.assigneeId, task.creatorId];
        title = `Task Status Updated: "${task.title}"`;
        body = `${actorName} moved task status to "${newStatus}" (was "${oldStatus}")`;
        meta = {
          ...meta,
          taskId,
          projectId: task.projectId,
          projectTitle: task.projectTitle,
          taskTitle: task.title,
          oldStatus,
          newStatus,
        };
        break;
      }

      case 'TASK_VERIFIED': {
        const { taskId, approved } = payload;
        const task = await getTaskInfo(taskId);
        if (!task) return;

        // Notify the task assignee
        recipients = [task.assigneeId];
        title = `Task ${approved ? 'Approved' : 'Revision Required'}: "${task.title}"`;
        body = approved
          ? `${actorName} approved your task.`
          : `${actorName} requested changes/revision for your task.`;
        meta = {
          ...meta,
          taskId,
          projectId: task.projectId,
          projectTitle: task.projectTitle,
          taskTitle: task.title,
          approved,
        };
        break;
      }

      case 'MEMBER_ADDED': {
        const { projectId, memberId } = payload;
        const project = await getProjectInfo(projectId);
        if (!project) return;

        recipients = [memberId];
        title = `Added to Project: "${project.title}"`;
        body = `${actorName} added you as a member to project "${project.title}"`;
        meta = {
          ...meta,
          projectId,
          projectTitle: project.title,
        };
        break;
      }

      case 'MEMBER_REMOVED': {
        const { projectId, memberId } = payload;
        const project = await getProjectInfo(projectId);
        if (!project) return;

        recipients = [memberId];
        title = `Removed from Project: "${project.title}"`;
        body = `${actorName} removed you from project "${project.title}"`;
        meta = {
          ...meta,
          projectId,
          projectTitle: project.title,
        };
        break;
      }

      case 'MEMBER_ROLE_CHANGED': {
        const { projectId, memberId, newRole } = payload;
        const project = await getProjectInfo(projectId);
        if (!project) return;

        recipients = [memberId];
        title = `Role Updated in "${project.title}"`;
        body = `${actorName} updated your project role to "${newRole}"`;
        meta = {
          ...meta,
          projectId,
          projectTitle: project.title,
          newRole,
        };
        break;
      }

      default:
        console.warn(`[NotificationDispatcher] Unknown type: ${type}`);
        return;
    }

    // Filter out: null/undefined, and actorId (don't notify yourself)
    const uniqueRecipients = [...new Set(recipients)]
      .filter(id => id !== null && id !== undefined && Number(id) !== Number(actorId));

    if (uniqueRecipients.length === 0) {
      return;
    }

    // Create notifications for each recipient in parallel
    await Promise.all(
      uniqueRecipients.map(async (userId) => {
        try {
          const newNotif = await NotificationModel.create(userId, type, title, body, meta);
          if (newNotif) {
            sendToUser(userId, 'notification', newNotif);
          }
        } catch (dbErr) {
          console.error(`[NotificationDispatcher] DB Insert failed for userId ${userId}:`, dbErr.message);
        }
      })
    );
  } catch (error) {
    console.error('[NotificationDispatcher] Dispatch failed:', error.message);
  }
};

export default {
  dispatch: dispatchNotification,
};
