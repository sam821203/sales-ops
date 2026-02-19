import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  updateProductSchema,
} from './dto/ecommerce.dto.js';
import { productService } from './product.service.js';

const products = new Hono();

// GET /products
products.get('/', zValidator('query', listProductsQuerySchema), async (c) => {
  const { page, pageSize, status, sortBy, sortOrder, q } = c.req.valid('query');
  const list = await productService.getProducts(page, pageSize, {
    status,
    sortBy,
    sortOrder,
    q,
  });
  return c.json(list);
});

// GET /products/:id
products.get('/:id', zValidator('param', productIdParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const product = await productService.getProductById(id);
  if (!product) {
    return c.json({ error: 'Not Found', message: 'Product not found' }, 404);
  }
  return c.json(product);
});

// POST /products
products.post('/', zValidator('json', createProductSchema), async (c) => {
  const body = c.req.valid('json');
  const created = await productService.createProduct(body);
  return c.json(created, 201);
});

// PATCH /products/:id
products.patch(
  '/:id',
  zValidator('param', productIdParamSchema),
  zValidator('json', updateProductSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const updated = await productService.updateProduct(id, body);
    if (!updated) {
      return c.json({ error: 'Not Found', message: 'Product not found' }, 404);
    }
    return c.json(updated);
  },
);

// DELETE /products/:id
products.delete('/:id', zValidator('param', productIdParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  await productService.deleteProduct(id);
  return c.body(null, 204);
});

export { products as productController };
