import 'dotenv/config';

import http from 'http';

import app from './src/app.js';
import pool from './src/config/db.js';
import env from './src/config/env.js';
import { initSocket } from './src/config/socket.js';
import { initReminderService } from './src/services/reminder.service.js';

async function startServer() {
  const httpServer = http.createServer(app);

  // Initialize socket server
  initSocket(httpServer);

  const server = httpServer.listen(env.server.port, () => {
    console.log(
      `Server is running on port ${env.server.port} in ${env.server.nodeEnv} mode (WebSocket enabled)`
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
