import type {
  CreateSkuPriceHistoryInput,
  ListPriceHistoryQuery,
  ListPriceHistoryResponse,
  SkuPriceHistoryListItem,
} from '@salesops/shared';
import { apiFetch } from '@/api/client';

export const priceHistoryKeys = {
  all: ['price-history'] as const,
  list: (params: ListPriceHistoryQuery) =>
    [...priceHistoryKeys.all, 'list', params] as const,
  detail: (id: number) => [...priceHistoryKeys.all, 'detail', id] as const,
};

export async function getPriceHistoryList(
  params: ListPriceHistoryQuery
): Promise<ListPriceHistoryResponse> {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q != null && params.q.trim() !== '') {
    search.set('q', params.q.trim());
  }
  return apiFetch<ListPriceHistoryResponse>(`/priceHistory?${search.toString()}`);
}

export async function getPriceHistoryById(
  id: number
): Promise<SkuPriceHistoryListItem | null> {
  try {
    return await apiFetch<SkuPriceHistoryListItem>(`/priceHistory/${id}`);
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 404) return null;
    throw e;
  }
}

export async function createPriceHistory(
  body: CreateSkuPriceHistoryInput
): Promise<SkuPriceHistoryListItem> {
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
  return apiFetch<SkuPriceHistoryListItem>('/priceHistory', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
