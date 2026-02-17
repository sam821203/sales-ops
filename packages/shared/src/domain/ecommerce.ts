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

export type AttributeDefinition =
  | { key: string; label: string; type: 'text' }
  | { key: string; label: string; type: 'enum'; options: string[] };

export const STANDARD_ATTRIBUTE_DEFINITIONS: AttributeDefinition[] = [
  { key: 'Color', label: 'Color', type: 'enum', options: ['Black', 'White', 'Silver', 'Blue'] },
  { key: 'Storage', label: 'Storage / Capacity', type: 'enum', options: ['128GB', '256GB', '512GB', '1TB'] },
  { key: 'Size', label: 'Size / Screen Size', type: 'enum', options: ['6.1"', '6.7"', '15"', '27"'] },
  { key: 'RAM', label: 'RAM / Memory', type: 'enum', options: ['8GB', '16GB', '32GB'] },
  { key: 'Length', label: 'Length', type: 'enum', options: ['1m', '2m', '3m'] },
  { key: 'Layout', label: 'Layout', type: 'enum', options: ['US', 'UK', 'JP'] },
  { key: 'Switch', label: 'Switch', type: 'enum', options: ['Brown', 'Red', 'Blue', 'Silent'] },
  { key: 'Material', label: 'Material', type: 'enum', options: ['Aluminum', 'Plastic'] },
  { key: 'Connectivity', label: 'Connectivity', type: 'enum', options: ['WiFi', 'WiFi+Cellular', 'Bluetooth 5.0'] },
  { key: 'Voltage', label: 'Voltage / Power', type: 'enum', options: ['110V', '220V', '65W', '100W'] },
  { key: 'Model', label: 'Model / Variant', type: 'text' },
  { key: 'Compatibility', label: 'Compatibility', type: 'text' },
];

export type Product = {
  id: number;
  name: string;
  status: ProductStatus;
  skus: SKU[];
  imageUrl?: string;
  categoryId?: number;
  brandId?: number;
  attributeDefinitions?: AttributeDefinition[];
};

export type SKU = {
  id: number;
  productId: number;
  price: number;
  stock: number;
  attributes: Record<string, string>;
};

// Product API request types (align with API validation)
export type CreateSkuInput = {
  productId: number;
  price: number;
  stock: number;
  attributes: Record<string, string>;
};

export type CreateProductInput = {
  name: string;
  status: ProductStatus;
  skus: CreateSkuInput[];
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ListProductsQuery = {
  limit?: number;
  offset?: number;
  status?: ProductStatus;
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
