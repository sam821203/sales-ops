import type {
  InventoryAdjustmentType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentTransactionStatus,
  ProductStatus,
  PromotionStatusValue,
  RefundStatus,
  DiscountType,
} from '@salesops/shared';

type PrismaProductStatus = ProductStatus;
type PrismaDiscountType = DiscountType;
type PrismaOrderStatus = OrderStatus;
type PrismaPaymentStatus = PaymentStatus;
type PrismaInventoryAdjustmentType = InventoryAdjustmentType;
type PrismaPaymentMethod = PaymentMethod;
type PrismaPaymentTransactionStatus = PaymentTransactionStatus;
type PrismaPromotionStatus = PromotionStatusValue;
type PrismaRefundStatus = RefundStatus;

export const productStatusMap = {
  Draft: 'Draft',
  Active: 'Active',
  Inactive: 'Inactive',
} as const satisfies Record<PrismaProductStatus, ProductStatus>;

export const discountTypeMap = {
  Percentage: 'Percentage',
  FixedAmount: 'FixedAmount',
  BuyXGetY: 'BuyXGetY',
} as const satisfies Record<PrismaDiscountType, DiscountType>;

export const orderStatusMap = {
  Created: 'Created',
  Paying: 'Paying',
  Paid: 'Paid',
  Failed: 'Failed',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
} as const satisfies Record<PrismaOrderStatus, OrderStatus>;

export const paymentStatusMap = {
  Pending: 'Pending',
  Completed: 'Completed',
  Failed: 'Failed',
} as const satisfies Record<PrismaPaymentStatus, PaymentStatus>;

export const inventoryAdjustmentTypeMap = {
  Increase: 'Increase',
  Decrease: 'Decrease',
} as const satisfies Record<PrismaInventoryAdjustmentType, InventoryAdjustmentType>;

export const paymentMethodMap = {
  CreditCard: 'CreditCard',
  PayPal: 'PayPal',
  BankTransfer: 'BankTransfer',
  Cash: 'Cash',
} as const satisfies Record<PrismaPaymentMethod, PaymentMethod>;

export const paymentTransactionStatusMap = {
  Pending: 'Pending',
  Completed: 'Completed',
  Failed: 'Failed',
  Refunded: 'Refunded',
} as const satisfies Record<PrismaPaymentTransactionStatus, PaymentTransactionStatus>;

export const promotionStatusMap = {
  Active: 'Active',
  Inactive: 'Inactive',
  Expired: 'Expired',
} as const satisfies Record<PrismaPromotionStatus, PromotionStatusValue>;

export const refundStatusMap = {
  Requested: 'Requested',
  Processing: 'Processing',
  Completed: 'Completed',
  Failed: 'Failed',
} as const satisfies Record<PrismaRefundStatus, RefundStatus>;

export function toSharedProductStatus(status: PrismaProductStatus): ProductStatus {
  return productStatusMap[status];
}

export function toSharedDiscountType(type: PrismaDiscountType): DiscountType {
  return discountTypeMap[type];
}

export function toSharedOrderStatus(status: PrismaOrderStatus): OrderStatus {
  return orderStatusMap[status];
}

export function toSharedPaymentStatus(status: PrismaPaymentStatus): PaymentStatus {
  return paymentStatusMap[status];
}

export function toSharedInventoryAdjustmentType(
  type: PrismaInventoryAdjustmentType,
): InventoryAdjustmentType {
  return inventoryAdjustmentTypeMap[type];
}

export function toSharedPaymentMethod(method: PrismaPaymentMethod): PaymentMethod {
  return paymentMethodMap[method];
}

export function toSharedPaymentTransactionStatus(
  status: PrismaPaymentTransactionStatus,
): PaymentTransactionStatus {
  return paymentTransactionStatusMap[status];
}

export function toSharedPromotionStatus(status: PrismaPromotionStatus): PromotionStatusValue {
  return promotionStatusMap[status];
}

export function toSharedRefundStatus(status: PrismaRefundStatus): RefundStatus {
  return refundStatusMap[status];
}
