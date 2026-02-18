import type {
  Product,
  CreateProductInput,
  ListProductsQuery,
  ListProductsResponse,
  ProductSkuItemInput,
  UpdateProductInput,
} from '@salesops/shared';
import { apiFetch } from '@/api/client';

export const productKeys = {
  all: ['products'] as const,
  list: (params: ListProductsQuery) =>
    [...productKeys.all, 'list', params] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
};

export async function getProducts(
  params: ListProductsQuery
): Promise<ListProductsResponse> {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.status != null) search.set('status', params.status);
  if (params.sortBy != null) search.set('sortBy', params.sortBy);
  if (params.sortOrder != null) search.set('sortOrder', params.sortOrder);
  if (params.q != null && params.q.trim() !== '') search.set('q', params.q.trim());
  return apiFetch<ListProductsResponse>(`/products?${search.toString()}`);
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${id}`);
  } catch (e) {
    const err = e as Error & { status?: number };
    if (err.status === 404) return null;
    throw e;
  }
}

export async function createProduct(body: CreateProductInput): Promise<Product> {
  const payload = {
    name: body.name,
    status: body.status,
    skus: (body.skus ?? []).map((s: ProductSkuItemInput) => ({
      price: s.price,
      stock: s.stock,
      attributes: s.attributes ?? {},
    })),
  };
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(
  id: number,
  body: UpdateProductInput
): Promise<Product> {
  const payload: Record<string, unknown> = {};
  if (body.name !== undefined) payload.name = body.name;
  if (body.status !== undefined) payload.status = body.status;
  if (body.skus !== undefined) {
    payload.skus = body.skus.map((s: ProductSkuItemInput) => ({
      price: s.price,
      stock: s.stock,
      attributes: s.attributes ?? {},
    }));
  }
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await apiFetch<void>(`/products/${id}`, { method: 'DELETE' });
}
