export const deadlineReminderTemplate = ({
  memberName,
  taskTitle,
  projectTitle,
  deadline,
  remainingLabel,
  taskUrl,
}) => ({
  subject: `Upcoming Task Deadline: "${taskTitle}" is due soon! ⏰`,
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#ffffff;border:1px solid #eaeaea;border-radius:8px;overflow:hidden">
      <div style="background:#dc2626;padding:20px 24px;color:#fff">
        <h2 style="margin:0;font-size:20px">Task Deadline Reminder ⏰</h2>
      </div>
      <div style="padding:24px;color:#333;line-height:1.5">
        <p>Hi <strong>${memberName}</strong>,</p>
        <p>
          This is a friendly reminder that your assigned task <strong>"${taskTitle}"</strong> in project <strong>"${projectTitle}"</strong> is due soon!
        </p>
        <div style="background:#fef2f2;border-left:3.5px solid #dc2626;padding:14px 16px;border-radius:4px;margin:16px 0;color:#991b1b;font-size:14px">
          <p style="margin:0 0 6px 0"><strong>Deadline:</strong> ${deadline}</p>
          <p style="margin:0"><strong>Time Remaining:</strong> <span style="background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">${remainingLabel}</span></p>
        </div>
        <p style="margin-top:20px">
          <a href="${taskUrl}"
             style="background:#dc2626;color:#fff;padding:10px 20px;
                    border-radius:4px;text-decoration:none;display:inline-block;font-weight:600">
            View Task Details
          </a>
        </p>
        <p style="color:#999;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
          Please make sure to update the task status in TaskFlow once you make progress!
        </p>
      </div>
    </div>
  `,
});
