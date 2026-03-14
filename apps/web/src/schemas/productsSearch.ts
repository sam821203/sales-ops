import { z } from 'zod';

/** URL search params schema for products list (e.g. TanStack Router validateSearch). */
export const productsSearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['all', 'Draft', 'Active', 'Inactive']).optional(),
  sortBy: z.enum(['name', 'status', 'createdAt', 'skuCount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  /** When set, products list opens the Edit Product modal for this product ID (e.g. from product detail page). */
  edit: z.coerce.number().int().positive().optional(),
});

export type ProductsSearchParams = z.infer<typeof productsSearchSchema>;
