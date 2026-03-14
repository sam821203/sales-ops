import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Placeholder auth guard. Replace with JWT verification when implementing auth.
 * Usage: app.use('/protected/*', authGuard);
 */
export const authGuard = async (c: Context, next: Next): Promise<void> => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid Authorization header' });
  }
  // TODO: verify JWT, set c.set('user', payload)
  await next();
};
