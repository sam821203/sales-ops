import type { Context, Next } from 'hono';

/**
 * Request logging interceptor. Log method, path, status, and duration.
 */
export const requestLogger = async (c: Context, next: Next): Promise<void> => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const status = c.res.status;
  const method = c.req.method;
  const path = c.req.path;
  console.info(`[${method}] ${path} ${status} ${ms}ms`);
};
