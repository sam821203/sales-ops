import type { Context } from 'hono';
import type { z } from 'zod';
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  updateProductSchema,
} from './dto/ecommerce.dto.js';
import { productService } from './product.service.js';

export { createProductSchema, listProductsQuerySchema, productIdParamSchema, updateProductSchema };

type ListQuery = z.infer<typeof listProductsQuerySchema>;
type ParamId = z.infer<typeof productIdParamSchema>;
type CreateBody = z.infer<typeof createProductSchema>;
type UpdateBody = z.infer<typeof updateProductSchema>;

export const listProductsHandler = async (c: Context<object, string, { out: { query: ListQuery } }>) => {
  const { page, pageSize, status, sortBy, sortOrder, q } = c.req.valid('query');
  const list = await productService.getProducts(page, pageSize, {
    status,
    sortBy,
    sortOrder,
    q,
  });
  return c.json(list);
};

export const getProductByIdHandler = async (c: Context<object, string, { out: { param: ParamId } }>) => {
  const { id } = c.req.valid('param');
  const product = await productService.getProductById(id);
  if (!product) {
    return c.json({ error: 'Not Found', message: 'Product not found' }, 404);
  }
  return c.json(product);
};

export const createProductHandler = async (c: Context<object, string, { out: { json: CreateBody } }>) => {
  const body = c.req.valid('json');
  const created = await productService.createProduct(body);
  return c.json(created, 201);
};

export const updateProductHandler = async (c: Context<object, string, { out: { param: ParamId; json: UpdateBody } }>) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const updated = await productService.updateProduct(id, body);
  if (!updated) {
    return c.json({ error: 'Not Found', message: 'Product not found' }, 404);
  }
  return c.json(updated);
};

export const deleteProductHandler = async (c: Context<object, string, { out: { param: ParamId } }>) => {
  const { id } = c.req.valid('param');
  await productService.deleteProduct(id);
  return c.body(null, 204);
};
