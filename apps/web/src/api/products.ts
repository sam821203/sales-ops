import { getApiUrl, request } from '@/api/client';
import type {
  CreateProductInput,
  ListProductsQuery,
  ProductsDetailResponse,
  ProductsListResponse,
  UpdateProductInput,
} from '@/api/types';

export const productKeys = {
  all: ['products'] as const,
  list: (params: ListProductsQuery) =>
    [...productKeys.all, 'list', params] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
};

const buildProductsQuery = (params: ListProductsQuery): string => {
  const search = new URLSearchParams();
  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  if (params.status != null) search.set('status', params.status);
  if (params.sortBy != null) search.set('sortBy', params.sortBy);
  if (params.sortOrder != null) search.set('sortOrder', params.sortOrder);
  if (params.q != null && params.q.trim() !== '') search.set('q', params.q.trim());
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const getProducts = async (
  params: ListProductsQuery
): Promise<ProductsListResponse> => {
  const url = getApiUrl('/products') + buildProductsQuery(params);
  return request<ProductsListResponse>(url);
};

export const getProductById = async (
  id: number
): Promise<ProductsDetailResponse> => {
  const url = getApiUrl(`/products/${id}`);
  return request<ProductsDetailResponse>(url);
};

export const createProduct = async (
  body: CreateProductInput
): Promise<ProductsDetailResponse> => {
  const url = getApiUrl('/products');
  return request<ProductsDetailResponse>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: body.name,
      status: body.status,
      skus: body.skus ?? [],
      ...(body.imageUrl != null && body.imageUrl !== '' && { imageUrl: body.imageUrl }),
    }),
  });
};

export const updateProduct = async (
  id: number,
  body: UpdateProductInput
): Promise<ProductsDetailResponse> => {
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
  const url = getApiUrl(`/products/${id}`);
  return request<ProductsDetailResponse>(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  const url = getApiUrl(`/products/${id}`);
  await request<void>(url, { method: 'DELETE' });
};
