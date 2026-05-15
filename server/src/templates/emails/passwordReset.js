export const passwordResetTemplate = ({ name, resetUrl }) => ({
  subject: "Password Reset Request",
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2>Hi ${name},</h2>
      <p>Click below to reset your password. Link expires in <strong>15 minutes</strong>.</p>
      <a href="${resetUrl}"
         style="background:#e53e3e;color:#fff;padding:10px 20px;
                border-radius:4px;text-decoration:none">
        Reset Password
      </a>
      <p style="color:#999;font-size:12px;margin-top:16px">
        If you didn't request this, ignore this email.
      </p>
    </div>
  `,
})