import type { Context } from 'hono';
import { healthService } from './health.service.js';

export const healthHandler = (c: Context) => c.json(healthService.getStatus());

export const healthLiveHandler = (c: Context) => c.json({ status: 'ok' });
