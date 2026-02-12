import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { env } from '../../config/index.js';

type ErrorLike = Error & { code?: string; statusCode?: number };

/**
 * Central error handler. Masks internal details in production.
 */
export function errorHandler(err: ErrorLike, c: Context): Response {
  // Log server-side (never expose stack to client in production)
  console.error('[Error]', err.message, env.NODE_ENV === 'development' ? err.stack : '');

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  // Prisma / DB errors: do not leak details
  if (err.code === 'P2002') {
    return c.json({ error: 'Conflict', message: 'Resource already exists' }, 409);
  }
  if (err.code === 'P2025') {
    return c.json({ error: 'Not Found', message: 'Record not found' }, 404);
  }

  const message =
    env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  return c.json({ error: 'Internal Server Error', message }, 500);
}
