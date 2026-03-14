import {
  discountTypeValues,
  inventoryAdjustmentTypeValues,
  orderProcessingStatusValues,
  paymentMethodValues,
  paymentStatusValues,
  paymentTransactionStatusValues,
  productSortByValues,
  productStatusValues,
  promotionStatusValues,
  refundStatusValues,
} from '../constants/enums.js';

export type { ProductSortBy } from '../constants/enums.js';
import { z } from 'zod';

export const createSkuSchema = z.object({
  productId: z.number().int().positive(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  attributes: z.record(z.string(), z.string()),
});

export const createProductSkuItemSchema = z.object({
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  attributes: z.record(z.string(), z.string()),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  status: z.enum(productStatusValues),
  skus: z.array(createProductSkuItemSchema).default([]),
  imageUrl: z.union([z.string().url(), z.literal('')]).optional(),
});

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(productStatusValues).optional(),
  sortBy: z.enum(productSortByValues).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  q: z.string().optional(),
});

export const createPromotionSchema = z
  .object({
    name: z.string().min(1).max(255),
    period: z.object({
      start: z.coerce.date(),
      end: z.coerce.date(),
    }),
    discountType: z.enum(discountTypeValues),
    affectedSkus: z.array(z.number().int().positive()).default([]),
  })
  .refine((value) => value.period.end > value.period.start, {
    message: 'Promotion period end must be after start.',
    path: ['period', 'end'],
  });

export const createOrderItemSchema = z.object({
  skuId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1),
  totalAmount: z.number().nonnegative(),
  status: z.enum(orderProcessingStatusValues).default('Created'),
});

export const createPaymentSchema = z.object({
  orderId: z.number().int().positive(),
  status: z.enum(paymentStatusValues).default('Pending'),
  requestId: z.string().min(1).max(255),
});

export const createPaymentTransactionSchema = z.object({
  orderId: z.number().int().positive(),
  paymentMethod: z.enum(paymentMethodValues),
  amount: z.number().nonnegative(),
  status: z.enum(paymentTransactionStatusValues).default('Pending'),
  transactionId: z.string().min(1).max(255),
});

export const createPromotionStatusSchema = z.object({
  promotionId: z.number().int().positive(),
  status: z.enum(promotionStatusValues),
  updatedBy: z.number().int().positive(),
});

export const createRefundSchema = z.object({
  paymentTransactionId: z.number().int().positive(),
  amount: z.number().positive(),
  reason: z.string().min(1).max(500),
  status: z.enum(refundStatusValues).default('Requested'),
  processedAt: z.coerce.date().optional(),
});

export const listPriceHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
});

export const createSkuPriceHistorySchema = z.object({
  skuId: z.number().int().positive(),
  newPrice: z.number().nonnegative(),
  effectiveDate: z.coerce.date().optional(),
  changedBy: z.number().int().positive(),
});

export const priceHistoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listInventoryAdjustmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
});

export const createInventoryAdjustmentSchema = z.object({
  skuId: z.number().int().positive(),
  adjustmentType: z.enum(inventoryAdjustmentTypeValues),
  quantity: z.number().int().positive(),
  reason: z.string().min(1).max(500),
  adjustedBy: z.number().int().positive(),
});

export const inventoryAdjustmentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// --- Response schemas (JSON serialization: dates as string) ---

const attributeDefinitionSchema = z.discriminatedUnion('type', [
  z.object({ key: z.string(), label: z.string(), type: z.literal('text') }),
  z.object({
    key: z.string(),
    label: z.string(),
    type: z.literal('enum'),
    options: z.array(z.string()),
  }),
]);

export const skuSchema = z.object({
  id: z.number(),
  productId: z.number(),
  price: z.number(),
  stock: z.number(),
  attributes: z.record(z.string(), z.string()),
});

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(productStatusValues),
  skus: z.array(skuSchema),
  imageUrl: z.string().optional(),
  categoryId: z.number().optional(),
  brandId: z.number().optional(),
  attributeDefinitions: z.array(attributeDefinitionSchema).optional(),
});

export const listProductsResponseSchema = z.object({
  items: z.array(productSchema),
  total: z.number(),
});

export const inventoryAdjustmentListItemSchema = z.object({
  id: z.number(),
  skuId: z.number(),
  adjustmentType: z.enum(inventoryAdjustmentTypeValues),
  quantity: z.number(),
  reason: z.string(),
  adjustedBy: z.number(),
  createdAt: z.string(),
  productName: z.string(),
  productId: z.number(),
  skuAttributes: z.record(z.string(), z.string()),
});

export const listInventoryAdjustmentsResponseSchema = z.object({
  items: z.array(inventoryAdjustmentListItemSchema),
  total: z.number(),
});

export const skuPriceHistoryListItemSchema = z.object({
  id: z.number(),
  skuId: z.number(),
  oldPrice: z.number(),
  newPrice: z.number(),
  effectiveDate: z.string(),
  changedBy: z.number(),
  productName: z.string(),
  productId: z.number(),
  skuAttributes: z.record(z.string(), z.string()),
});

export const listPriceHistoryResponseSchema = z.object({
  items: z.array(skuPriceHistoryListItemSchema),
  total: z.number(),
});

// --- Inferred types ---

export type ProductIdParam = z.infer<typeof productIdParamSchema>;
export type CreateSkuInput = z.infer<typeof createSkuSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductSkuItemInput = z.infer<typeof createProductSkuItemSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type ListProductsResponse = z.infer<typeof listProductsResponseSchema>;
export type Product = z.infer<typeof productSchema>;
export type InventoryAdjustmentListItem = z.infer<typeof inventoryAdjustmentListItemSchema>;
export type ListInventoryAdjustmentsResponse = z.infer<typeof listInventoryAdjustmentsResponseSchema>;
export type SkuPriceHistoryListItem = z.infer<typeof skuPriceHistoryListItemSchema>;
export type ListPriceHistoryResponse = z.infer<typeof listPriceHistoryResponseSchema>;
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreatePaymentTransactionInput = z.infer<typeof createPaymentTransactionSchema>;
export type CreatePromotionStatusInput = z.infer<typeof createPromotionStatusSchema>;
export type CreateRefundInput = z.infer<typeof createRefundSchema>;
export type ListPriceHistoryQuery = z.infer<typeof listPriceHistoryQuerySchema>;
export type CreateSkuPriceHistoryInput = z.infer<typeof createSkuPriceHistorySchema>;
export type PriceHistoryIdParam = z.infer<typeof priceHistoryIdParamSchema>;
export type ListInventoryAdjustmentsQuery = z.infer<typeof listInventoryAdjustmentsQuerySchema>;
export type CreateInventoryAdjustmentInput = z.infer<typeof createInventoryAdjustmentSchema>;
export type InventoryAdjustmentIdParam = z.infer<typeof inventoryAdjustmentIdParamSchema>;