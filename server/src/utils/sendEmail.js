import { transporter } from "../config/mailer.js";
import env from "../config/env.js";

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: env.email.mailFrom,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};
