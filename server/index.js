import 'dotenv/config';

import app from './src/app.js';
import pool from './src/config/db.js';
import env from './src/config/env.js';
import { initReminderService } from './src/services/reminder.service.js';

async function startServer() {
  const server = app.listen(env.server.port, () => {
    console.log(
      `Server is running on port ${env.server.port} in ${env.server.nodeEnv} mode`
    );
  });

  await pool.getConnection();
  await initReminderService();

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

startServer().catch((err) => {
  console.error('Startup error: ', err);
  process.exit(1);
});
