import {
  getNotificationSettings,
  updateNotificationSettings,
} from '../services/notification.service.js';

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
    getSettings,
    updateSettings
}
