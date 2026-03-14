import type {
  CreateInventoryAdjustmentInput,
  InventoryAdjustmentListItem,
  ListInventoryAdjustmentsResponse,
} from './dto/ecommerce.dto.js';
import {
  INSUFFICIENT_STOCK,
  inventoryAdjustmentRepository,
} from './inventory-adjustment.repository.js';
import { toSharedInventoryAdjustmentType } from './mappers/enum.mapper.js';

export class SkuNotFoundError extends Error {
  constructor(message: string = 'SKU not found') {
    super(message);
    this.name = 'SkuNotFoundError';
  }
}

export class InsufficientStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientStockError';
  }
}

type PrismaRow = Awaited<
  ReturnType<typeof inventoryAdjustmentRepository.findById>
>;
type PrismaRowNonNull = NonNullable<PrismaRow>;

function toListItem(row: PrismaRowNonNull): InventoryAdjustmentListItem {
  const attrs = row.sku.attributes;
  const skuAttributes =
    typeof attrs === 'object' && attrs !== null && !Array.isArray(attrs)
      ? (attrs as Record<string, string>)
      : {};
  return {
    id: row.id,
    skuId: row.skuId,
    adjustmentType: toSharedInventoryAdjustmentType(row.adjustmentType),
    quantity: row.quantity,
    reason: row.reason,
    adjustedBy: row.adjustedBy,
    createdAt: row.createdAt.toISOString(),
    productName: row.sku.product.name,
    productId: row.sku.productId,
    skuAttributes,
  };
}

/**
 * Business logic only. No HTTP/framework types.
 */
export const inventoryAdjustmentService = {
  async getList(
    page: number,
    pageSize: number,
    options: { q?: string }
  ): Promise<ListInventoryAdjustmentsResponse> {
    const { items, total } =
      await inventoryAdjustmentRepository.findManyAndCount(
        page,
        pageSize,
        options
      );
    return { items: items.map(toListItem), total };
  },

  async getById(id: number): Promise<InventoryAdjustmentListItem | null> {
    const row = await inventoryAdjustmentRepository.findById(id);
    return row ? toListItem(row) : null;
  },

  async create(
    data: CreateInventoryAdjustmentInput
  ): Promise<InventoryAdjustmentListItem> {
    const result = await inventoryAdjustmentRepository.create(data);
    if (result === null) {
      throw new SkuNotFoundError(`SKU with ID ${data.skuId} does not exist.`);
    }
    if (result === INSUFFICIENT_STOCK) {
      throw new InsufficientStockError(
        `SKU ${data.skuId} has insufficient stock for decrease of ${data.quantity}.`
      );
    }
    return toListItem(result);
  },
};
