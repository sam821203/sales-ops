/**
 * Health service – framework-agnostic business logic.
 * No Hono/HTTP types here.
 */
export const healthService = {
  getStatus(): { status: string; timestamp: string; uptime: number } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  },
};
