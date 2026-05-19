import { getApiUrl, request } from '@/api/client';
import type {
  CreateSkuPriceHistoryInput,
  ListPriceHistoryQuery,
  PriceHistoryDetailResponse,
  PriceHistoryListResponse,
} from '@/api/types';

export const priceHistoryKeys = {
  all: ['price-history'] as const,
  list: (params: ListPriceHistoryQuery) =>
    [...priceHistoryKeys.all, 'list', params] as const,
  detail: (id: number) => [...priceHistoryKeys.all, 'detail', id] as const,
};

const buildPriceHistoryQuery = (params: ListPriceHistoryQuery): string => {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q != null && params.q.trim() !== '') search.set('q', params.q.trim());
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const getPriceHistoryList = async (
  params: ListPriceHistoryQuery
): Promise<PriceHistoryListResponse> => {
  const url = getApiUrl('/priceHistory') + buildPriceHistoryQuery(params);
  return request<PriceHistoryListResponse>(url);
};

export const getPriceHistoryById = async (
  id: number
): Promise<PriceHistoryDetailResponse> => {
  const url = getApiUrl(`/priceHistory/${id}`);
  return request<PriceHistoryDetailResponse>(url);
};

export const createPriceHistory = async (
  body: CreateSkuPriceHistoryInput
): Promise<PriceHistoryDetailResponse> => {
  const url = getApiUrl('/priceHistory');
  const payload = {
    skuId: body.skuId,
    newPrice: body.newPrice,
    changedBy: body.changedBy,
    ...(body.effectiveDate != null && {
      effectiveDate: body.effectiveDate,
    }),
  };
  return request<PriceHistoryDetailResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};
