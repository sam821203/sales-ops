import type {
  CreateSkuPriceHistoryInput,
  ListPriceHistoryQuery,
} from '@salesops/shared';
import { apiClient } from '@/api/client';
import type {
  PriceHistoryDetailResponse,
  PriceHistoryListResponse,
} from '@/api/types';

export const priceHistoryKeys = {
  all: ['price-history'] as const,
  list: (params: ListPriceHistoryQuery) =>
    [...priceHistoryKeys.all, 'list', params] as const,
  detail: (id: number) => [...priceHistoryKeys.all, 'detail', id] as const,
};

export async function getPriceHistoryList(
  params: ListPriceHistoryQuery
): Promise<PriceHistoryListResponse> {
  const res = await apiClient.priceHistory.$get({
    query: {
      page: String(params.page),
      pageSize: String(params.pageSize),
      ...(params.q != null && params.q.trim() !== '' ? { q: params.q.trim() } : {}),
    },
  });
  return res.json();
}

export async function getPriceHistoryById(
  id: number
): Promise<PriceHistoryDetailResponse | null> {
  const res = await apiClient.priceHistory[':id'].$get({
    param: { id: String(id) },
  });
  if (res.status === 404) {
    return null;
  }
  return res.json();
}

export async function createPriceHistory(
  body: CreateSkuPriceHistoryInput
): Promise<PriceHistoryDetailResponse> {
  const payload: Record<string, unknown> = {
    skuId: body.skuId,
    newPrice: body.newPrice,
    changedBy: body.changedBy,
  };
  if (body.effectiveDate != null) {
    payload.effectiveDate =
      body.effectiveDate instanceof Date
        ? body.effectiveDate.toISOString()
        : body.effectiveDate;
  }
  const res = await apiClient.priceHistory.$post({
    json: payload,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data === 'object' && data !== null && 'message' in data && typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : 'Failed to create price history'
    );
  }
  return data as PriceHistoryDetailResponse;
}
