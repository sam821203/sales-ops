import type { Context } from 'hono';
import { healthService } from './health.service.js';

export const healthHandler = (c: Context): Response => c.json(healthService.getStatus());

export const healthLiveHandler = (c: Context): Response => c.json({ status: 'ok' });
