import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import env from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import routes from './routes.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
        'img-src': ["'self'", 'data:', 'cdnjs.cloudflare.com'],
      },
    },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        env.client.url,
        ...(env.client.additional
          ? env.client.additional.split(',').map((u) => u.trim())
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
const swaggerUiOptions = {
  customCssUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js',
  ],
};

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

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
