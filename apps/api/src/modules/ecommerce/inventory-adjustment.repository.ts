import type { CreateInventoryAdjustmentInput } from './dto/ecommerce.dto.js';
import type { InventoryAdjustmentGetPayload } from '../../../generated/prisma/models/InventoryAdjustment.js';
import { prisma } from '../../lib/prisma.js';

/** Prisma payload for InventoryAdjustment with sku and product included (matches our queries). */
type InventoryAdjustmentWithSkuAndProduct = InventoryAdjustmentGetPayload<{
  include: { sku: { include: { product: true } } };
}>;

type OrCondition =
  | { sku: { product: { name: { contains: string } } } }
  | { skuId: number };
type WhereClause = { OR: OrCondition[] };

const buildWhere = (q?: string): WhereClause | undefined => {
  const qTrim = q?.trim();
  if (!qTrim) return undefined;
  const or: Array<
    { sku: { product: { name: { contains: string } } } } | { skuId: number }
  > = [{ sku: { product: { name: { contains: qTrim } } } }];
  const id = /^\d+$/.test(qTrim) ? parseInt(qTrim, 10) : NaN;
  if (!Number.isNaN(id)) or.push({ skuId: id });
  return { OR: or };
};

/** Sentinel returned by create() when Decrease would make stock negative. */
export const INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK' as const;

/**
 * Data access only. No business logic; all SQL/ORM here.
 */
export const inventoryAdjustmentRepository = {
  async findManyAndCount(
    page: number,
    pageSize: number,
    options: { q?: string }
  ): Promise<{ items: InventoryAdjustmentWithSkuAndProduct[]; total: number }> {
    const where = buildWhere(options.q);
    const skip = (page - 1) * pageSize;
    return prisma.$transaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.inventoryAdjustment.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
          include: { sku: { include: { product: true } } },
        }),
        tx.inventoryAdjustment.count({ where }),
      ]);
      return { items, total };
    });
  },

  async findById(id: number): Promise<InventoryAdjustmentWithSkuAndProduct | null> {
    return prisma.inventoryAdjustment.findUnique({
      where: { id },
      include: { sku: { include: { product: true } } },
    });
  },

  async create(
    data: CreateInventoryAdjustmentInput
  ): Promise<InventoryAdjustmentWithSkuAndProduct | null | typeof INSUFFICIENT_STOCK> {
    return prisma.$transaction(async (tx) => {
      const sku = await tx.sku.findUnique({
        where: { id: data.skuId },
        select: { id: true, stock: true },
      });
      if (!sku) return null;
      if (
        data.adjustmentType === 'Decrease' &&
        sku.stock < data.quantity
      ) {
        return INSUFFICIENT_STOCK;
      }
      const row = await tx.inventoryAdjustment.create({
        data: {
          skuId: data.skuId,
          adjustmentType: data.adjustmentType,
          quantity: data.quantity,
          reason: data.reason,
          adjustedBy: data.adjustedBy,
        },
        include: { sku: { include: { product: true } } },
      });
      const newStock =
        data.adjustmentType === 'Increase'
          ? sku.stock + data.quantity
          : sku.stock - data.quantity;
      await tx.sku.update({
        where: { id: data.skuId },
        data: { stock: newStock },
      });
      return row;
    });
  },
};
