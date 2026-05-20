import { sendEmail } from "../utils/sendEmail.js";
import env from "../config/env.js";
import { welcomeTemplate } from "../templates/emails/welcome.js";
import { passwordResetTemplate } from "../templates/emails/passwordReset.js";
import { addMemberTemplate } from "../templates/emails/addMember.js";
import { removeMemberTemplate } from "../templates/emails/removeMember.js";

export const sendWelcomeEmail = async ({ name, email }) => {
  const { subject, html } = welcomeTemplate({ name });
  await sendEmail({ to: email, subject, html });
};

export const sendPasswordResetEmail = async ({ name, email, resetUrl }) => {
  const { subject, html } = passwordResetTemplate({ name, resetUrl });
  await sendEmail({ to: email, subject, html });
};

export const sendProjectMemberAddedEmail = async ({
  memberName,
  memberEmail,
  projectId,
  projectTitle,
  projectDescription,
  ownerName,
  role,
}) => {
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
  memberName,
  memberEmail,
  projectTitle,
  ownerName,
  reason,
}) => {
  const { subject, html } = removeMemberTemplate({
    memberName,
    projectTitle,
    ownerName,
    reason,
  });
  await sendEmail({ to: memberEmail, subject, html });
};
