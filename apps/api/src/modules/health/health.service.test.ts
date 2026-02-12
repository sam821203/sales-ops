import { describe, it, expect } from 'vitest';
import { healthService } from './health.service.js';

describe('healthService', () => {
  it('getStatus returns ok, timestamp, and uptime', () => {
    const result = healthService.getStatus();
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
    expect(typeof result.uptime).toBe('number');
  });
});
