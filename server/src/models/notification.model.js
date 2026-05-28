import callProcedure from '../config/callProcedure.js';

const NotificationModel = {
  /**
   * Create a single notification.
   */
  create: async (userId, type, title, body, meta = null) => {
    const stringifiedMeta = meta ? JSON.stringify(meta) : null;
    const [rows] = await callProcedure('sp_CreateNotification', [
      userId,
      type,
      title,
      body,
      stringifiedMeta,
    ]);
    return rows[0];
  },
  /**
   * Get paginated notifications for a user.
   */
  getByUser: async (userId, limit, offset) => {
    const [rows] = await callProcedure('sp_GetNotifications', [
      userId,
      limit,
      offset,
    ]);
    return rows;
  },

  /**
   * Get the count of unread notifications.
   */
  getUnreadCount: async (userId) => {
    const [rows] = await callProcedure('sp_GetUnreadCount', [userId]);
    return rows[0]?.unreadCount ?? 0;
  },

  /**
   * Mark a notification as read.
   */
  markRead: async (id, userId) => {
    const [rows] = await callProcedure('sp_MarkNotificationRead', [id, userId]);
    return (rows[0]?.updatedCount ?? 0) > 0;
  },

  /**
   * Mark all notifications of a user as read.
   */
  markAllRead: async (userId) => {
    const [rows] = await callProcedure('sp_MarkAllNotificationsRead', [userId]);
    return (rows[0]?.updatedCount ?? 0) > 0;
  },

  /**
   * Hard-delete a single notification.
   */
  delete: async (id, userId) => {
    const [rows] = await callProcedure('sp_DeleteNotification', [id, userId]);
    return (rows[0]?.deletedCount ?? 0) > 0;
  },
};

export default NotificationModel;
