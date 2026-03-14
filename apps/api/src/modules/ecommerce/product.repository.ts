import type {
  CreateProductInput,
  ProductSortBy,
  UpdateProductInput,
} from './dto/ecommerce.dto.js';
import { prisma } from '../../lib/prisma.js';

type ProductStatus = 'Draft' | 'Active' | 'Inactive';

/** Product name search uses contains; on SQLite, LIKE is case-sensitive. */
const buildWhere = (options: { status?: ProductStatus; q?: string }): { status?: ProductStatus; name?: { contains: string } } | undefined => {
  const conditions: { status?: ProductStatus; name?: { contains: string } } = {};
  if (options.status !== undefined) conditions.status = options.status;
  if (options.q !== undefined && options.q.trim() !== '') {
    conditions.name = { contains: options.q.trim() };
  }
  return Object.keys(conditions).length > 0 ? conditions : undefined;
};

const buildOrderBy = (sortBy?: ProductSortBy, sortOrder: 'asc' | 'desc' = 'desc'): Record<string, unknown> => {
  if (sortBy === undefined || sortBy === 'createdAt') {
    return { createdAt: sortOrder };
  }
  if (sortBy === 'skuCount') {
    return { skus: { _count: sortOrder } };
  }
  return { [sortBy]: sortOrder };
};

/**
 * Data access only. No business logic; all SQL/ORM here.
 */
const toPrismaAttributes = (attrs: Record<string, string>): object => ({ ...attrs });

export const productRepository = {
  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- return type inferred from Prisma include */
  async create(data: CreateProductInput) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: data.name,
          status: data.status,
          imageUrl: data.imageUrl || null,
        },
      });
      if (data.skus.length > 0) {
        await tx.sku.createMany({
          data: data.skus.map((sku) => ({
            productId: product.id,
            price: sku.price,
            stock: sku.stock,
            attributes: toPrismaAttributes(sku.attributes),
          })),
        });
      }
      return tx.product.findUniqueOrThrow({
        where: { id: product.id },
        include: { skus: true },
      });
    });
  },

  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- return type inferred from Prisma include */
  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: { skus: true },
    });
  },

  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- return type inferred from Prisma include */
  async findMany(
    page: number,
    pageSize: number,
    options: {
      status?: ProductStatus;
      sortBy?: ProductSortBy;
      sortOrder?: 'asc' | 'desc';
      q?: string;
    }
  ) {
    const where = buildWhere({ status: options.status, q: options.q });
    const orderBy = buildOrderBy(options.sortBy, options.sortOrder ?? 'desc');
    const skip = (page - 1) * pageSize;
    return prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: { skus: true },
    });
  },

  async count(options: { status?: ProductStatus; q?: string }): Promise<number> {
    const where = buildWhere(options);
    return prisma.product.count({ where });
  },

  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- return type inferred from Prisma include */
  async findManyAndCount(
    page: number,
    pageSize: number,
    options: {
      status?: ProductStatus;
      sortBy?: ProductSortBy;
      sortOrder?: 'asc' | 'desc';
      q?: string;
    }
  ) {
    const where = buildWhere({ status: options.status, q: options.q });
    const orderBy = buildOrderBy(options.sortBy, options.sortOrder ?? 'desc');
    const skip = (page - 1) * pageSize;
    return prisma.$transaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.product.findMany({
          where,
          skip,
          take: pageSize,
          orderBy,
          include: { skus: true },
        }),
        tx.product.count({ where }),
      ]);
      return { items, total };
    });
  },

  /* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- return type inferred from Prisma */
  async update(id: number, data: UpdateProductInput) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) return null;

      if (data.skus !== undefined) {
        await tx.sku.deleteMany({ where: { productId: id } });
        if (data.skus.length > 0) {
          await tx.sku.createMany({
            data: data.skus.map((sku) => ({
              productId: id,
              price: sku.price,
              stock: sku.stock,
              attributes: toPrismaAttributes(sku.attributes),
            })),
          });
        }
      }

      return tx.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        },
        include: { skus: true },
      });
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  },
};
