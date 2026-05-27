import swaggerJsdoc from 'swagger-jsdoc';

import env from './env.js';

const serverUrls = [
  env.server.url,
  ...(env.server.additional
    ? env.server.additional.split(',').map((url) => url.trim())
    : []),
].filter(Boolean);

const servers = serverUrls.map((url) => ({
  url: url.endsWith('/api') ? url : `${url}/api`,
  description: url.includes('localhost') ? 'Local Environment' : 'Production/Staging Environment',
}));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API docs for Task Management',
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/docs/*.js', './src/schema/*.js'], // ← scans docs + schemas
};

export const swaggerSpec = swaggerJsdoc(options);
