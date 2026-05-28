import NotificationModel from '../models/notification.model.js';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '../services/notification.service.js';

/**
 * Retrieve notifications feed + unread count.
 */
const getNotifications = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const notifications = await NotificationModel.getByUser(
      req.user.id,
      limit,
      offset
    );
    const unreadCount = await NotificationModel.getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark a single notification as read.
 */
const markRead = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const success = await NotificationModel.markRead(id, req.user.id);

    res.json({
      success,
      message: success
        ? 'Notification marked as read'
        : 'Notification not found or unauthorized',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark all user notifications as read.
 */
const markAllRead = async (req, res, next) => {
  try {
    const success = await NotificationModel.markAllRead(req.user.id);

    res.json({
      success,
      message: 'All notifications marked as read',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a single notification.
 */
const deleteNotification = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const success = await NotificationModel.delete(id, req.user.id);

    res.json({
      success,
      message: success
        ? 'Notification deleted successfully'
        : 'Notification not found or unauthorized',
    });
  } catch (err) {
    next(err);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await getNotificationSettings(req.user.id);
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await updateNotificationSettings(req.user.id, req.body);
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

export {
  deleteNotification,
  getNotifications,
  getSettings,
  markAllRead,
  markRead,
  updateSettings,
};
