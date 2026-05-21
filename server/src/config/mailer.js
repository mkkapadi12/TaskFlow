import nodemailer from 'nodemailer';

import env from './env.js';

export const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: false, // true for 465
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

// verify connection on startup
transporter.verify((err) => {
  if (err) console.error('❌ Mailer error:', err);
  else console.log('✅ Mailer ready');
});
