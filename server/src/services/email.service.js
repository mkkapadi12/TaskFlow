import { sendEmail } from "../utils/sendEmail.js";
import { welcomeTemplate } from "../templates/emails/welcome.js";
import { passwordResetTemplate } from "../templates/emails/passwordReset.js";

export const sendWelcomeEmail = async ({ name, email }) => {
  const { subject, html } = welcomeTemplate({ name });
  await sendEmail({ to: email, subject, html });
};

export const sendPasswordResetEmail = async ({ name, email, resetUrl }) => {
  const { subject, html } = passwordResetTemplate({ name, resetUrl });
  await sendEmail({ to: email, subject, html });
};
