import { getApiUrl, request } from '@/api/client';
import type { UploadResponse } from '@/api/types';

export const uploadProductImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const url = getApiUrl('/upload');
  return request<UploadResponse>(url, {
    method: 'POST',
    body: formData,
  });
};
