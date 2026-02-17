import type { CreateProductInput, UpdateProductInput } from './dto/ecommerce.dto.js';
import type { Product } from '@salesops/shared';
import { toSharedProductStatus } from './mappers/enum.mapper.js';
import { productRepository } from './product.repository.js';

type PrismaProductWithSkus = Awaited<ReturnType<typeof productRepository.findById>>;
type PrismaProductWithSkusNonNull = NonNullable<PrismaProductWithSkus>;

function toProduct(row: PrismaProductWithSkusNonNull): Product {
  return {
    id: row.id,
    name: row.name,
    status: toSharedProductStatus(row.status),
    skus: row.skus.map((sku) => ({
      id: sku.id,
      productId: sku.productId,
      price: sku.price,
      stock: sku.stock,
      attributes: sku.attributes as Record<string, string>,
    })),
  };
}

/**
 * Business logic only. No HTTP/framework types.
 */
export const productService = {
  async createProduct(data: CreateProductInput): Promise<Product> {
    const product = await productRepository.create(data);
    return toProduct(product);
  },

  async getProductById(id: number): Promise<Product | null> {
    const product = await productRepository.findById(id);
    return product ? toProduct(product) : null;
  },

  async getProducts(limit: number, offset: number, status?: 'Draft' | 'Active' | 'Inactive'): Promise<Product[]> {
    const products = await productRepository.findMany(limit, offset, status);
    return products.map(toProduct);
  },

  async updateProduct(id: number, data: UpdateProductInput): Promise<Product | null> {
    const product = await productRepository.update(id, data);
    return product ? toProduct(product) : null;
  },

  async deleteProduct(id: number): Promise<void> {
    await productRepository.delete(id);
  },
};
