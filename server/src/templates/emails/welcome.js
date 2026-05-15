export const welcomeTemplate = ({ name }) => ({
  subject: "Welcome to Task Manager 🎉",
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2>Hey ${name}, welcome aboard!</h2>
      <p>Your account is ready. Start managing tasks now.</p>
      <a href="${process.env.CLIENT_URL}/dashboard"
         style="background:#faa432;color:#fff;padding:10px 20px;
                border-radius:4px;text-decoration:none">
        Go to Dashboard
      </a>
    </div>
  `,
})