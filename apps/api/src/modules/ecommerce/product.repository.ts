import type { CreateProductInput, UpdateProductInput } from './dto/ecommerce.dto.js';
import { prisma } from '../../lib/prisma.js';

/**
 * Data access only. No business logic; all SQL/ORM here.
 */
export const productRepository = {
  async create(data: CreateProductInput) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        status: data.status,
      },
    });
    if (data.skus.length > 0) {
      await prisma.sku.createMany({
        data: data.skus.map((sku) => ({
          productId: product.id,
          price: sku.price,
          stock: sku.stock,
          attributes: sku.attributes as object,
        })),
      });
    }
    return prisma.product.findUniqueOrThrow({
      where: { id: product.id },
      include: { skus: true },
    });
  },

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: { skus: true },
    });
  },

  async findMany(limit: number, offset: number, status?: 'Draft' | 'Active' | 'Inactive') {
    return prisma.product.findMany({
      where: status !== undefined ? { status } : undefined,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: { skus: true },
    });
  },

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
              attributes: sku.attributes as object,
            })),
          });
        }
      }

      return tx.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.status !== undefined && { status: data.status }),
        },
        include: { skus: true },
      });
    });
  },

  async delete(id: number) {
    await prisma.product.delete({
      where: { id },
    });
  },
};
