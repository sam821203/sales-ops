import type { CreateSkuPriceHistoryInput } from './dto/ecommerce.dto.js';
import { prisma } from '../../lib/prisma.js';

/** Product name search is case-insensitive (mode: 'insensitive'). On SQLite, if this does not work, fall back to a two-phase query with LOWER(). */
function buildWhere(q?: string) {
  const qTrim = q?.trim();
  if (!qTrim) return undefined;
  const or: Array<
    | { sku: { product: { name: { contains: string; mode: 'insensitive' } } } }
    | { skuId: number }
  > = [{ sku: { product: { name: { contains: qTrim, mode: 'insensitive' } } } }];
  const id = /^\d+$/.test(qTrim) ? parseInt(qTrim, 10) : NaN;
  if (!Number.isNaN(id)) or.push({ skuId: id });
  return { OR: or };
}

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

  async getSkuPrice(skuId: number): Promise<number | null> {
    const sku = await prisma.sku.findUnique({
      where: { id: skuId },
      select: { price: true },
    });
    return sku?.price ?? null;
  },

  async create(data: CreateSkuPriceHistoryInput) {
    const effectiveDate = data.effectiveDate ?? new Date();
    return prisma.$transaction(async (tx) => {
      const sku = await tx.sku.findUnique({
        where: { id: data.skuId },
        select: { id: true, price: true },
      });
      if (!sku) return null;
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
