import type {
  CreateInventoryAdjustmentInput,
  ListInventoryAdjustmentsQuery,
  ListInventoryAdjustmentsResponse,
  InventoryAdjustmentListItem,
} from '@salesops/shared';
import { apiFetch } from '@/api/client';

export const inventoryAdjustmentKeys = {
  all: ['inventory-adjustments'] as const,
  list: (params: ListInventoryAdjustmentsQuery) =>
    [...inventoryAdjustmentKeys.all, 'list', params] as const,
  detail: (id: number) =>
    [...inventoryAdjustmentKeys.all, 'detail', id] as const,
};

export async function getInventoryAdjustmentsList(
  params: ListInventoryAdjustmentsQuery
): Promise<ListInventoryAdjustmentsResponse> {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.q != null && params.q.trim() !== '') {
    search.set('q', params.q.trim());
  }
  return apiFetch<ListInventoryAdjustmentsResponse>(
    `/inventoryAdjustments?${search.toString()}`
  );
}

export async function getInventoryAdjustmentById(
  id: number
): Promise<InventoryAdjustmentListItem | null> {
  try {
    return await apiFetch<InventoryAdjustmentListItem>(
      `/inventoryAdjustments/${id}`
    );
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 404) return null;
    throw e;
  }
}

export async function createInventoryAdjustment(
  body: CreateInventoryAdjustmentInput
): Promise<InventoryAdjustmentListItem> {
  return apiFetch<InventoryAdjustmentListItem>('/inventoryAdjustments', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
