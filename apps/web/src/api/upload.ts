import { apiClient } from '@/api/client';
import type { UploadResponse } from '@/api/types';

export async function uploadProductImage(file: File): Promise<UploadResponse> {
  const res = await apiClient.upload.$post({
    form: {
      file,
    },
  });
  return res.json();
}
