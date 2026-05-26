import env from '../config/env.js';
import { addMemberTemplate } from '../templates/emails/addMember.js';
import { deadlineReminderTemplate } from '../templates/emails/deadlineReminder.js';
import { passwordResetTemplate } from '../templates/emails/passwordReset.js';
import { removeMemberTemplate } from '../templates/emails/removeMember.js';
import { welcomeTemplate } from '../templates/emails/welcome.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getNotificationSettings } from './notification.service.js';

// helper: get settings once, check flag
const canSend = async (userId, flag) => {
  if (!userId) return true; // system email, no user → always send
  const settings = await getNotificationSettings(userId);
  return settings[flag] === 1;
};

export const sendWelcomeEmail = async ({ userId, name, email }) => {
  if (!(await canSend(userId, 'welcome'))) return;
  const { subject, html } = welcomeTemplate({ name });
  await sendEmail({ to: email, subject, html });
};

export const sendPasswordResetEmail = async ({
  userId,
  name,
  email,
  resetUrl,
}) => {
  if (!(await canSend(userId, 'passwordReset'))) return;
  const { subject, html } = passwordResetTemplate({ name, resetUrl });
  await sendEmail({ to: email, subject, html });
};

export const sendProjectMemberAddedEmail = async ({
  memberId,
  memberName,
  memberEmail,
  projectId,
  projectTitle,
  projectDescription,
  ownerName,
  role,
}) => {
  if (!(await canSend(memberId, 'memberAdded'))) return;
  const projectUrl = `${env.client.url}/projects/${projectId}`;
  const { subject, html } = addMemberTemplate({
    memberName,
    projectTitle,
    projectDescription,
    ownerName,
    role,
    projectUrl,
  });
  await sendEmail({ to: memberEmail, subject, html });
};

export const sendProjectMemberRemovedEmail = async ({
  memberId,
  memberName,
  memberEmail,
  projectTitle,
  ownerName,
  reason,
}) => {
  if (!(await canSend(memberId, 'memberRemoved'))) return;
  const { subject, html } = removeMemberTemplate({
    memberName,
    projectTitle,
    ownerName,
    reason,
  });
  await sendEmail({ to: memberEmail, subject, html });
};

export const sendDeadlineReminderEmail = async ({
  memberName,
  memberEmail,
  taskTitle,
  projectTitle,
  deadline,
  remainingLabel,
  projectId,
}) => {
  const taskUrl = `${env.client.url}/projects/${projectId}`;
  const { subject, html } = deadlineReminderTemplate({
    memberName,
    taskTitle,
    projectTitle,
    deadline,
    remainingLabel,
    taskUrl,
  });
  await sendEmail({ to: memberEmail, subject, html });
};
