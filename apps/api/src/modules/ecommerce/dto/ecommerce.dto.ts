import {
  discountTypeValues,
  orderProcessingStatusValues,
  paymentMethodValues,
  paymentStatusValues,
  paymentTransactionStatusValues,
  productSortByValues,
  productStatusValues,
  promotionStatusValues,
  refundStatusValues,
} from '@salesops/shared';
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

export type {
  CreateSkuInput,
  CreateProductInput,
  ListProductsQuery,
  ListProductsResponse,
  UpdateProductInput,
  ProductSkuItemInput,
} from '@salesops/shared';
export type ProductIdParam = z.infer<typeof productIdParamSchema>;
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreatePaymentTransactionInput = z.infer<typeof createPaymentTransactionSchema>;
export type CreatePromotionStatusInput = z.infer<typeof createPromotionStatusSchema>;
export type CreateRefundInput = z.infer<typeof createRefundSchema>;
