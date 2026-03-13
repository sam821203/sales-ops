import type { ProductStatus } from '@salesops/shared';
import type { ProductsListResponse } from '@/api/types';

export type StatusFilter = ProductStatus | 'all';

export type ProductRow = ProductsListResponse['items'][number] & {
  key: number;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  categoryName?: string;
  brandName?: string;
};
