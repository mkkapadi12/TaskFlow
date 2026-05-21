export const addMemberTemplate = ({
  memberName,
  projectTitle,
  projectDescription,
  ownerName,
  role,
  projectUrl,
}) => ({
  subject: `You've been added to "${projectTitle}"`,
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#ffffff;border:1px solid #eaeaea;border-radius:8px;overflow:hidden">
      <div style="background:#faa432;padding:20px 24px;color:#fff">
        <h2 style="margin:0;font-size:20px">You're on the team! 🎉</h2>
      </div>
      <div style="padding:24px;color:#333;line-height:1.5">
        <p>Hi <strong>${memberName}</strong>,</p>
        <p>
          <strong>${ownerName}</strong> added you to the project
          <strong>"${projectTitle}"</strong> as
          <span style="display:inline-block;background:#faa43215;color:#a3680c;padding:2px 8px;border-radius:4px;font-size:13px;font-weight:600">
            ${role}
          </span>.
        </p>
        ${
          projectDescription
            ? `<div style="background:#f7f7f7;border-left:3px solid #faa432;padding:12px 14px;border-radius:4px;margin:16px 0;color:#555;font-size:14px">
                ${projectDescription}
              </div>`
            : ''
        }
        <p style="margin-top:20px">
          <a href="${projectUrl}"
             style="background:#faa432;color:#fff;padding:10px 20px;
                    border-radius:4px;text-decoration:none;display:inline-block;font-weight:600">
            Open Project
          </a>
        </p>
        <p style="color:#999;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
          If you weren't expecting this, you can ignore this email or reach out to ${ownerName}.
        </p>
      </div>
    </div>
  `,
});
