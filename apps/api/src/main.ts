import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { env } from './config/index.js';
import { errorHandler } from './common/filters/error-handler.js';
import { requestLogger } from './common/interceptors/logging.js';
import { api } from './app.js';

const app = new Hono({ strict: false });

// Global middleware: CORS first (handles preflight), then logging
app.use('*', cors({ origin: env.CORS_ORIGIN ?? '*' }));
app.use('*', requestLogger);

// API sub-app: mounted at API_PREFIX in app.route below
app.route(env.API_PREFIX, api);

// 404
app.notFound((_c): never => {
  throw new HTTPException(404, { message: 'Not Found' });
});

// Error handler (must be last)
app.onError((err, c) => errorHandler(err, c));

// Start server when run directly
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`API listening on http://${info.address}:${info.port}${env.API_PREFIX}`);
});

export { app };
