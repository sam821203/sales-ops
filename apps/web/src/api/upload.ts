import { getApiUrl } from '@/api/client';

export async function uploadProductImage(file: File): Promise<{ url: string }> {
  const url = getApiUrl('/upload');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text) as { message?: string };
      message = json.message ?? text;
    } catch {
      // use text as-is
    }
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<{ url: string }>;
}
