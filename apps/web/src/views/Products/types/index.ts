import type { Product, ProductStatus } from '@salesops/shared';

export type StatusFilter = ProductStatus | 'all';

export type ProductRow = Product & {
  key: number;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
};
