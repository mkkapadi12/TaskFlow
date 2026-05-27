import callProcedure from '../config/callProcedure.js';
import env from '../config/env.js';
import { sendDeadlineReminderEmail } from './email.service.js';

// Helper to calculate relative remaining time string for the email
const getRemainingHoursLabel = (deadlineStr) => {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffHours <= 0) return 'Due now';
  if (diffHours < 24) return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`;

  const diffDays = Math.ceil(diffHours / 24);
  return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
};

// Main task check and SMTP email dispatch job
export const checkAndSendReminders = async () => {
  try {
    const [tasks] = await callProcedure('sp_GetUpcomingTaskReminders', []);

    if (!tasks || tasks.length === 0) {
      return;
    }

    for (const task of tasks) {
      try {
        const remainingLabel = getRemainingHoursLabel(task.deadline);
        const formattedDeadline = new Date(task.deadline).toLocaleString(
          'en-IN',
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          }
        );

        await sendDeadlineReminderEmail({
          memberName: task.assigneeName,
          memberEmail: task.assigneeEmail,
          taskTitle: task.title,
          projectTitle: task.projectTitle,
          deadline: formattedDeadline,
          remainingLabel,
          projectId: task.projectId,
        });

        // Mark as sent in DB
        await callProcedure('sp_MarkTaskReminderSent', [task.id]);
      } catch (emailErr) {
        console.error(
          `[Reminder Service] Failed to process email for task ID ${task.id}:`,
          emailErr.message
        );
      }
    }
  } catch (err) {
    console.error(
      '[Reminder Service] Error running checkAndSendReminders:',
      err.message
    );
  }
};

// Start scheduling
export const initReminderService = async () => {
  // If running in serverless environment, bypass in-memory scheduler
  if (env.vercel.isVercel) {
    console.log(
      '[Reminder Service] Running on Vercel. Background scheduler bypassed.'
    );
    return;
  }

  // 1. Perform immediate check at server startup
  await checkAndSendReminders();

  // 2. Schedule checking job to run every 24 hours (86400000ms)
  setInterval(() => {
    checkAndSendReminders();
  }, 86400000);
};
