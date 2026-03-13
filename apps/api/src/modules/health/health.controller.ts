import type { Context } from 'hono';
import { healthService } from './health.service.js';

export function healthHandler(c: Context) {
  return c.json(healthService.getStatus());
}

export function healthLiveHandler(c: Context) {
  return c.json({ status: 'ok' });
}
