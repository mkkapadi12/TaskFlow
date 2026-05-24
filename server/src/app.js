import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import env from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import routes from './routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        env.client.url,
        ...(process.env.ADDITIONAL_CLIENT_URLS
          ? process.env.ADDITIONAL_CLIENT_URLS.split(',').map((u) => u.trim())
          : []),
      ].filter(Boolean);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);
app.use(express.json());

// mount after other middleware
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api', (req, res) =>
  res.json({ status: 'ok', message: 'API is live!' })
);

app.use('/api', routes);

// 404 handler — for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(globalErrorHandler);

export default app;
