import type { ProductStatus } from '@salesops/shared';

/** Tailwind classes for product status tags (Active / Draft / Inactive). */
export const getProductStatusClass = (status: ProductStatus): string => {
  if (status === 'Active')
    return '!rounded-full border-0 bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300';
  if (status === 'Draft')
    return '!rounded-full border-0 bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
  return '!rounded-full border-0 bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300';
};

/** Tailwind classes for stock level tags (out of stock / low / in stock). Low = &lt; 10. */
export const getStockStatusClass = (stock: number): string => {
  if (stock === 0)
    return '!rounded-full border-0 bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300';
  if (stock < 10)
    return '!rounded-full border-0 bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
  return '!rounded-full border-0 bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300';
};
