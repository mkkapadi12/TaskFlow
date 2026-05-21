import callProcedure from '../config/callProcedure.js';

const DEFAULT_SETTINGS = {
  welcome: 1,
  passwordReset: 1,
  memberAdded: 1,
  memberRemoved: 1,
};

const getNotificationSettings = async (userId) => {
  try {
    const [rows] = await callProcedure('sp_GetNotificationSettings', [userId]);
    return rows[0] ?? DEFAULT_SETTINGS;
  } catch {
    // If the procedure fails (e.g. table not yet created), default to all enabled
    return DEFAULT_SETTINGS;
  }
};

const updateNotificationSettings = async (userId, settings) => {
  const { welcome, passwordReset, memberAdded, memberRemoved } = settings;
  const [rows] = await callProcedure('sp_UpdateNotificationSettings', [
    userId,
    welcome ?? null,
    passwordReset ?? null,
    memberAdded ?? null,
    memberRemoved ?? null,
  ]);
  return rows[0];
};

export { getNotificationSettings, updateNotificationSettings };
