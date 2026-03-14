import { apiClient } from '@/api/client';
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

export async function getInventoryAdjustmentsList(
  params: ListInventoryAdjustmentsQuery
): Promise<InventoryAdjustmentsListResponse> {
  const res = await apiClient.inventoryAdjustments.$get({
    query: {
      page: params.page,
      pageSize: params.pageSize,
      ...(params.q != null && params.q.trim() !== '' ? { q: params.q.trim() } : {}),
    },
  });
  return res.json();
}

export async function getInventoryAdjustmentById(
  id: number
): Promise<InventoryAdjustmentDetailResponse | null> {
  const res = await apiClient.inventoryAdjustments[':id'].$get({
    param: { id },
  });
  if (res.status === 404) {
    return null;
  }
  return res.json();
}

export async function createInventoryAdjustment(body: CreateInventoryAdjustmentInput) {
  const res = await apiClient.inventoryAdjustments.$post({
    json: body,
  });
  return res.json();
}
