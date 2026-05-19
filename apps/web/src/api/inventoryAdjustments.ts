import { getApiUrl, request } from '@/api/client';
import type {
  CreateInventoryAdjustmentInput,
  InventoryAdjustmentDetailResponse,
  InventoryAdjustmentsListResponse,
  ListInventoryAdjustmentsQuery,
} from '@/api/types';

export const inventoryAdjustmentKeys = {
  all: ['inventory-adjustments'] as const,
  list: (params: ListInventoryAdjustmentsQuery) =>
    [...inventoryAdjustmentKeys.all, 'list', params] as const,
  detail: (id: number) =>
    [...inventoryAdjustmentKeys.all, 'detail', id] as const,
};

const buildInventoryAdjustmentsQuery = (params: ListInventoryAdjustmentsQuery): string => {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q != null && params.q.trim() !== '') search.set('q', params.q.trim());
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const getInventoryAdjustmentsList = async (
  params: ListInventoryAdjustmentsQuery
): Promise<InventoryAdjustmentsListResponse> => {
  const url = getApiUrl('/inventoryAdjustments') + buildInventoryAdjustmentsQuery(params);
  return request<InventoryAdjustmentsListResponse>(url);
};

export const getInventoryAdjustmentById = async (
  id: number
): Promise<InventoryAdjustmentDetailResponse> => {
  const url = getApiUrl(`/inventoryAdjustments/${id}`);
  return request<InventoryAdjustmentDetailResponse>(url);
};

export const createInventoryAdjustment = async (
  body: CreateInventoryAdjustmentInput
): Promise<InventoryAdjustmentDetailResponse> => {
  const url = getApiUrl('/inventoryAdjustments');
  return request<InventoryAdjustmentDetailResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};
