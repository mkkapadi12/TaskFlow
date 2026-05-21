export const removeMemberTemplate = ({
  memberName,
  projectTitle,
  ownerName,
  reason,
}) => ({
  subject: `You have been removed from "${projectTitle}"`,
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#ffffff;border:1px solid #eaeaea;border-radius:8px;overflow:hidden">
      <div style="background:#e53e3e;padding:20px 24px;color:#fff">
        <h2 style="margin:0;font-size:20px">Project access removed</h2>
      </div>
      <div style="padding:24px;color:#333;line-height:1.5">
        <p>Hi <strong>${memberName}</strong>,</p>
        <p>
          <strong>${ownerName}</strong> has removed you from the project
          <strong>"${projectTitle}"</strong>. You no longer have access to its tasks or members.
        </p>

        <div style="background:#fff5f5;border-left:3px solid #e53e3e;padding:12px 14px;border-radius:4px;margin:16px 0">
          <div style="font-size:12px;font-weight:600;color:#9b2c2c;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">
            Reason
          </div>
          <div style="color:#555;font-size:14px">
            ${reason && reason.trim() ? reason : 'No reason was provided.'}
          </div>
        </div>

        <p style="color:#666;font-size:13px;margin-top:20px">
          If you believe this was a mistake, please reach out to ${ownerName} directly.
        </p>

        <p style="color:#999;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
          This is an automated notification from Task Manager.
        </p>
      </div>
    </div>
  `,
});
