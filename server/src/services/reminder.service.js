import callProcedure from '../config/callProcedure.js';
import pool from '../config/db.js';
import { sendDeadlineReminderEmail } from './email.service.js';

// Run column migration dynamically on boot
const runMigration = async () => {
  try {
    // 1. Migrate tasks table
    const [taskCols] = await pool.query(`
      SHOW COLUMNS FROM tasks LIKE 'reminderSent';
    `);
    if (taskCols.length === 0) {
      await pool.query(`
        ALTER TABLE tasks ADD COLUMN reminderSent TINYINT(1) NOT NULL DEFAULT 0;
      `);
      console.log(
        'Database migrated: reminderSent column added to tasks table.'
      );
    }

    // 2. Migrate projects table
    const [projectCols] = await pool.query(`
      SHOW COLUMNS FROM projects LIKE 'allowReminders';
    `);
    if (projectCols.length === 0) {
      await pool.query(`
        ALTER TABLE projects ADD COLUMN allowReminders TINYINT(1) NOT NULL DEFAULT 1;
      `);
      console.log(
        'Database migrated: allowReminders column added to projects table.'
      );
    }

    console.log('Database migration verification completed.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
};

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
  console.log('[Reminder Service] Checking for upcoming task deadlines...');
  try {
    const [tasks] = await callProcedure('sp_GetUpcomingTaskReminders', []);

    if (!tasks || tasks.length === 0) {
      console.log(
        '[Reminder Service] No upcoming task deadlines require notifications.'
      );
      return;
    }

    console.log(
      `[Reminder Service] Found ${tasks.length} task(s) near deadline. Sending reminder emails...`
    );

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
        console.log(
          `[Reminder Service] Email sent successfully and marked in database for task ID ${task.id} ("${task.title}").`
        );
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
  console.log('[Reminder Service] Initializing service...');

  // 1. Run migration verification
  await runMigration();

  // 2. Perform immediate check at server startup
  await checkAndSendReminders();

  // 3. Schedule checking job to run every hour (3600000ms)
  setInterval(() => {
    checkAndSendReminders();
  }, 3600000);

  console.log(
    '[Reminder Service] Systematic deadline reminder scheduling is active.'
  );
};
