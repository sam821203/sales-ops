import { hc } from 'hono/client';
import type { AppType } from '@salesops/api/app';
import { mapHttpError } from '@/api/errorHandler';

const getApiBaseUrl = (): string => {
  try {
    const env = import.meta.env;
    const v =
      env && typeof env === 'object' && 'VITE_API_URL' in env
        ? (env as { VITE_API_URL?: string }).VITE_API_URL
        : undefined;
    if (typeof v === 'string' && v.trim() !== '') return v;
  } catch {
    // ignore
  }
  return 'http://localhost:3000';
};
const apiBaseUrl = getApiBaseUrl();

export const getApiUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}/api${normalized}`;
};

/**
 * Centralized fetch wrapper. Uses res.ok to throw on 4xx/5xx so TanStack Query
 * receives errors. Parses JSON safely; treats 204 as success with undefined.
 */
export const request = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(input, init);
  const text = await res.text();

  if (!res.ok) {
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = undefined;
    }
    throw mapHttpError(res.status, data);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  try {
    return (text ? JSON.parse(text) : undefined) as T;
  } catch {
    throw new Error('Invalid JSON response');
  }
};

/** Type-only: RPC client shape for InferResponseType in types.ts. Do not use for network calls. */
export type RpcClient = ReturnType<typeof hc<AppType>>;
