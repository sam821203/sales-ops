import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { env } from './config/index.js';
import { errorHandler } from './common/filters/error-handler.js';
import { requestLogger } from './common/interceptors/logging.js';
import { healthController } from './modules/health/health.controller.js';
import { userController } from './modules/user/user.controller.js';

const app = new Hono({ strict: false });

// Global middleware
app.use('*', requestLogger);

// API prefix
const api = new Hono().basePath(env.API_PREFIX);

// RESTful routes
api.route('/health', healthController);
api.route('/users', userController);

// OpenAPI doc (static contract; extend with @hono/zod-openapi if needed)
api.get('/openapi.json', (c) => {
  const baseUrl = c.req.url.replace(/\/openapi\.json.*$/, '');
  return c.json({
    openapi: '3.0.0',
    info: { title: 'SalesOps API', version: '0.0.0' },
    servers: [{ url: baseUrl }],
    paths: {
      '/health': {
        get: { summary: 'Health check', responses: { 200: { description: 'OK' } } },
      },
      '/users': {
        get: { summary: 'List users', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create user', responses: { 201: { description: 'Created' } } },
      },
      '/users/{id}': {
        get: { summary: 'Get user by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        patch: { summary: 'Update user', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        delete: { summary: 'Delete user', responses: { 204: { description: 'No Content' }, 404: { description: 'Not Found' } } },
      },
    },
  });
});

app.route(env.API_PREFIX, api);

// 404
app.notFound((_c) => {
  throw new HTTPException(404, { message: 'Not Found' });
});

// Error handler (must be last)
app.onError((err, c) => errorHandler(err, c));

// Start server when run directly
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`API listening on http://${info.address}:${info.port}${env.API_PREFIX}`);
});

export { app };
