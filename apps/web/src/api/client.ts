const baseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';

export function getApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/api${normalized}`;
}

export type ApiError = {
  error?: string;
  message?: string;
};

async function parseErrorResponse(response: Response): Promise<ApiError> {
  const text = await response.text();
  try {
    return JSON.parse(text) as ApiError;
  } catch {
    return { message: text || response.statusText };
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await parseErrorResponse(res);
    const e = new Error(err.message ?? err.error ?? `HTTP ${res.status}`) as Error & { status?: number };
    e.status = res.status;
    throw e;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
