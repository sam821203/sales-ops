export const productStatusValues = ['Draft', 'Active', 'Inactive'] as const;
export type ProductStatus = (typeof productStatusValues)[number];

export const discountTypeValues = ['Percentage', 'FixedAmount', 'BuyXGetY'] as const;
export type DiscountType = (typeof discountTypeValues)[number];

export const orderStatusValues = ['Created', 'Paying', 'Paid', 'Failed', 'Shipped', 'Delivered', 'Cancelled'] as const;
export type OrderStatus = (typeof orderStatusValues)[number];
export const orderProcessingStatusValues = ['Created', 'Paying', 'Paid', 'Failed'] as const satisfies readonly OrderStatus[];
export type OrderProcessingStatus = (typeof orderProcessingStatusValues)[number];
export type OrderHistoryStatus = OrderStatus;

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

export const auditEntityTypeValues = ['Product', 'Order', 'Payment', 'Inventory', 'Promotion'] as const;
export type AuditEntityType = (typeof auditEntityTypeValues)[number];

export const refundStatusValues = ['Requested', 'Processing', 'Completed', 'Failed'] as const;
export type RefundStatus = (typeof refundStatusValues)[number];

export type Category = {
  id: number;
  name: string;
};

export type Brand = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  status: ProductStatus;
  skus: SKU[];
  imageUrl?: string;
  categoryId?: number;
  brandId?: number;
};

export type SKU = {
  id: number;
  productId: number;
  price: number;
  stock: number;
  attributes: Record<string, string>;
};

export type Promotion = {
  id: number;
  name: string;
  period: {
    start: Date;
    end: Date;
  };
  discountType: DiscountType;
  affectedSkus: number[];
};

export type Order = {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderProcessingStatus;
};

export type OrderItem = {
  skuId: number;
  quantity: number;
  price: number;
};

export type Payment = {
  id: number;
  orderId: number;
  status: PaymentStatus;
  requestId: string;
};

export type ProductPriceHistory = {
  id: number;
  productId: number;
  oldPrice: number;
  newPrice: number;
  effectiveDate: Date;
  changedBy: number;
};

export type InventoryAdjustment = {
  id: number;
  skuId: number;
  adjustmentType: InventoryAdjustmentType;
  quantity: number;
  reason: string;
  adjustedBy: number;
  createdAt: Date;
};

export type OrderStatusHistory = {
  id: number;
  orderId: number;
  status: OrderHistoryStatus;
  updatedAt: Date;
  updatedBy: number;
};

export type PaymentTransaction = {
  id: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentTransactionStatus;
  transactionId: string;
  createdAt: Date;
  refundedAt?: Date;
};

export type PromotionStatus = {
  id: number;
  promotionId: number;
  status: PromotionStatusValue;
  updatedAt: Date;
  updatedBy: number;
};

export type AuditLog = {
  id: number;
  action: string;
  entityType: AuditEntityType;
  entityId: number;
  performedBy: number;
  createdAt: Date;
};

export type VendorCommission = {
  id: number;
  vendorId: number;
  orderId: number;
  commissionRate: number;
  commissionAmount: number;
  createdAt: Date;
};

export type Refund = {
  id: number;
  paymentTransactionId: number;
  amount: number;
  reason: string;
  status: RefundStatus;
  processedAt?: Date;
  createdAt: Date;
};
