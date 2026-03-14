/** Enum constants for ecommerce domain (used in Zod schemas). */

export const productStatusValues = ['Draft', 'Active', 'Inactive'] as const;
export type ProductStatus = (typeof productStatusValues)[number];

export const discountTypeValues = ['Percentage', 'FixedAmount', 'BuyXGetY'] as const;
export type DiscountType = (typeof discountTypeValues)[number];

export const orderStatusValues = [
  'Created',
  'Paying',
  'Paid',
  'Failed',
  'Shipped',
  'Delivered',
  'Cancelled',
] as const;
export type OrderStatus = (typeof orderStatusValues)[number];

export const orderProcessingStatusValues = ['Created', 'Paying', 'Paid', 'Failed'] as const;
export type OrderProcessingStatus = (typeof orderProcessingStatusValues)[number];

export const paymentStatusValues = ['Pending', 'Completed', 'Failed'] as const;
export type PaymentStatus = (typeof paymentStatusValues)[number];

export const inventoryAdjustmentTypeValues = ['Increase', 'Decrease'] as const;
export type InventoryAdjustmentType = (typeof inventoryAdjustmentTypeValues)[number];

export const paymentMethodValues = ['CreditCard', 'PayPal', 'BankTransfer', 'Cash'] as const;
export type PaymentMethod = (typeof paymentMethodValues)[number];

export const paymentTransactionStatusValues = ['Pending', 'Completed', 'Failed', 'Refunded'] as const;
export type PaymentTransactionStatus = (typeof paymentTransactionStatusValues)[number];

export const promotionStatusValues = ['Active', 'Inactive', 'Expired'] as const;
export type PromotionStatusValue = (typeof promotionStatusValues)[number];

export const refundStatusValues = ['Requested', 'Processing', 'Completed', 'Failed'] as const;
export type RefundStatus = (typeof refundStatusValues)[number];

export const productSortByValues = ['name', 'status', 'createdAt', 'skuCount'] as const;
export type ProductSortBy = (typeof productSortByValues)[number];
