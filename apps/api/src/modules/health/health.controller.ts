import { Hono } from 'hono';
import { healthService } from './health.service.js';

const health = new Hono();

health.get('/', (c) => {
  const result = healthService.getStatus();
  return c.json(result);
});

health.get('/live', (c) => {
  return c.json({ status: 'ok' });
});

export { health as healthController };
