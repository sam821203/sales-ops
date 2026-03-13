import { hc } from 'hono/client';
import type { AppType } from '@salesops/api/app';

const apiBaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';

export function getApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}/api${normalized}`;
}

export const apiClient = hc<AppType>(`${apiBaseUrl}/api`);
export type RpcClient = typeof apiClient;
