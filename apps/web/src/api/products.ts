import { apiClient } from '@/api/client';
import type {
  CreateProductInput,
  ListProductsQuery,
  ProductsDetailResponse,
  ProductsListResponse,
  ProductsUpdateBody,
  UpdateProductInput,
} from '@/api/types';

export const productKeys = {
  all: ['products'] as const,
  list: (params: ListProductsQuery) =>
    [...productKeys.all, 'list', params] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
};

export async function getProducts(
  params: ListProductsQuery
): Promise<ProductsListResponse> {
  const res = await apiClient.products.$get({
    query: {
      page: params.page,
      pageSize: params.pageSize,
      ...(params.status != null ? { status: params.status } : {}),
      ...(params.sortBy != null ? { sortBy: params.sortBy } : {}),
      ...(params.sortOrder != null ? { sortOrder: params.sortOrder } : {}),
      ...(params.q != null && params.q.trim() !== '' ? { q: params.q.trim() } : {}),
    },
  });
  return res.json();
}

export async function getProductById(
  id: number
): Promise<ProductsDetailResponse | null> {
  const res = await apiClient.products[':id'].$get({
    param: { id },
  });
  if (res.status === 404) {
    return null;
  }
  return res.json();
}

export async function createProduct(
  body: CreateProductInput
): Promise<ProductsDetailResponse> {
  const res = await apiClient.products.$post({
    json: {
      name: body.name,
      status: body.status,
      skus: body.skus ?? [],
      ...(body.imageUrl != null && body.imageUrl !== '' && { imageUrl: body.imageUrl }),
    },
  });
  return res.json();
}

export async function updateProduct(id: number, body: UpdateProductInput) {
  const payload: Record<string, unknown> = {};
  if (body.name !== undefined) payload.name = body.name;
  if (body.status !== undefined) payload.status = body.status;
  if (body.imageUrl !== undefined) payload.imageUrl = body.imageUrl || null;
  if (body.skus !== undefined) {
    payload.skus = body.skus.map((s) => ({
      price: s.price,
      stock: s.stock,
      attributes: s.attributes ?? {},
    }));
  }
  // RPC client does not infer json body for this PATCH route; request shape is typed explicitly.
  type PatchRequest = { param: { id: number }; json: ProductsUpdateBody };
  const res = await (apiClient.products[':id'].$patch as (opts: PatchRequest) => ReturnType<typeof apiClient.products[':id']['$patch']>)({
    param: { id },
    json: payload as ProductsUpdateBody,
  });
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.products[':id'].$delete({
    param: { id },
  });
}
