import type {
  DiscountType,
  InventoryAdjustmentType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentTransactionStatus,
  ProductStatus,
  PromotionStatusValue,
  RefundStatus,
} from '../constants/enums.js';

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

export const toSharedProductStatus = (status: PrismaProductStatus): ProductStatus =>
  productStatusMap[status];

export const toSharedDiscountType = (type: PrismaDiscountType): DiscountType =>
  discountTypeMap[type];

export const toSharedOrderStatus = (status: PrismaOrderStatus): OrderStatus =>
  orderStatusMap[status];

export const toSharedPaymentStatus = (status: PrismaPaymentStatus): PaymentStatus =>
  paymentStatusMap[status];

export const toSharedInventoryAdjustmentType = (
  type: PrismaInventoryAdjustmentType,
): InventoryAdjustmentType => inventoryAdjustmentTypeMap[type];

export const toSharedPaymentMethod = (method: PrismaPaymentMethod): PaymentMethod =>
  paymentMethodMap[method];

export const toSharedPaymentTransactionStatus = (
  status: PrismaPaymentTransactionStatus,
): PaymentTransactionStatus => paymentTransactionStatusMap[status];

export const toSharedPromotionStatus = (status: PrismaPromotionStatus): PromotionStatusValue =>
  promotionStatusMap[status];

export const toSharedRefundStatus = (status: PrismaRefundStatus): RefundStatus =>
  refundStatusMap[status];
