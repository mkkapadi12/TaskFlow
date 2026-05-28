import 'dotenv/config';

import mysql from 'mysql2/promise';

import env from './env.js';

const pool = mysql.createPool({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  port: env.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log('MySQL connected successfully');
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection failed:', err.message);
    // Do not call process.exit(1) in serverless environments to prevent hard crashes.
    // The pool will attempt reconnection dynamically on incoming requests.
  });

export default pool;
