import type { CreateSkuPriceHistoryInput } from './dto/ecommerce.dto.js';
import { prisma } from '../../lib/prisma.js';

/** Product name search uses contains; on SQLite, LIKE is case-sensitive. */
function buildWhere(q?: string) {
  const qTrim = q?.trim();
  if (!qTrim) return undefined;
  const or: Array<
    { sku: { product: { name: { contains: string } } } } | { skuId: number }
  > = [{ sku: { product: { name: { contains: qTrim } } } }];
  const id = /^\d+$/.test(qTrim) ? parseInt(qTrim, 10) : NaN;
  if (!Number.isNaN(id)) or.push({ skuId: id });
  return { OR: or };
}

/** Sentinel returned by create() when SKU price equals newPrice (no-op). */
export const PRICE_UNCHANGED = 'PRICE_UNCHANGED' as const;

/**
 * Data access only. No business logic; all SQL/ORM here.
 */
export const skuPriceHistoryRepository = {
  async findManyAndCount(
    page: number,
    pageSize: number,
    options: { q?: string }
  ) {
    const where = buildWhere(options.q);
    const skip = (page - 1) * pageSize;
    return prisma.$transaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.skuPriceHistory.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { effectiveDate: 'desc' },
          include: { sku: { include: { product: true } } },
        }),
        tx.skuPriceHistory.count({ where }),
      ]);
      return { items, total };
    });
  },

  async findById(id: number) {
    return prisma.skuPriceHistory.findUnique({
      where: { id },
      include: { sku: { include: { product: true } } },
    });
  },

  async create(data: CreateSkuPriceHistoryInput) {
    const effectiveDate = data.effectiveDate ?? new Date();
    return prisma.$transaction(async (tx) => {
      const sku = await tx.sku.findUnique({
        where: { id: data.skuId },
        select: { id: true, price: true },
      });
      if (!sku) return null;
      if (sku.price === data.newPrice) return PRICE_UNCHANGED;
      const oldPrice = sku.price;
      const row = await tx.skuPriceHistory.create({
        data: {
          skuId: data.skuId,
          oldPrice,
          newPrice: data.newPrice,
          effectiveDate,
          changedBy: data.changedBy,
        },
        include: { sku: { include: { product: true } } },
      });
      await tx.sku.update({
        where: { id: data.skuId },
        data: { price: data.newPrice },
      });
      return row;
    });
  },
};
