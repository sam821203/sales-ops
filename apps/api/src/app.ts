import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { healthHandler, healthLiveHandler } from './modules/health/health.controller.js';
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  updateProductSchema,
  listProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from './modules/ecommerce/product.controller.js';
import {
  createSkuPriceHistorySchema,
  listPriceHistoryQuerySchema,
  priceHistoryIdParamSchema,
  listPriceHistoryHandler,
  getPriceHistoryByIdHandler,
  createPriceHistoryHandler,
} from './modules/ecommerce/sku-price-history.controller.js';
import {
  createInventoryAdjustmentSchema,
  listInventoryAdjustmentsQuerySchema,
  inventoryAdjustmentIdParamSchema,
  listInventoryAdjustmentsHandler,
  getInventoryAdjustmentByIdHandler,
  createInventoryAdjustmentHandler,
} from './modules/ecommerce/inventory-adjustment.controller.js';
import { uploadHandler } from './modules/upload/upload.controller.js';
import {
  createUserSchema,
  listUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from './modules/user/user.controller.js';

// Single Hono with one continuous chain (no .route()) so RPC schema is preserved for hc<AppType>.
const api = new Hono()
  .get('/health', healthHandler)
  .get('/health/live', healthLiveHandler)
  .get('/priceHistory', zValidator('query', listPriceHistoryQuerySchema), listPriceHistoryHandler)
  .get('/priceHistory/:id', zValidator('param', priceHistoryIdParamSchema), getPriceHistoryByIdHandler)
  .post('/priceHistory', zValidator('json', createSkuPriceHistorySchema), createPriceHistoryHandler)
  .get('/inventoryAdjustments', zValidator('query', listInventoryAdjustmentsQuerySchema), listInventoryAdjustmentsHandler)
  .get('/inventoryAdjustments/:id', zValidator('param', inventoryAdjustmentIdParamSchema), getInventoryAdjustmentByIdHandler)
  .post('/inventoryAdjustments', zValidator('json', createInventoryAdjustmentSchema), createInventoryAdjustmentHandler)
  .get('/products', zValidator('query', listProductsQuerySchema), listProductsHandler)
  .get('/products/:id', zValidator('param', productIdParamSchema), getProductByIdHandler)
  .post('/products', zValidator('json', createProductSchema), createProductHandler)
  .patch('/products/:id', zValidator('param', productIdParamSchema), zValidator('json', updateProductSchema), updateProductHandler)
  .delete('/products/:id', zValidator('param', productIdParamSchema), deleteProductHandler)
  .post('/upload', uploadHandler)
  .get('/users', listUsersHandler)
  .get('/users/:id', getUserByIdHandler)
  .post('/users', zValidator('json', createUserSchema), createUserHandler)
  .patch('/users/:id', updateUserHandler)
  .delete('/users/:id', deleteUserHandler)
  .get('/openapi.json', (c) => {
    const baseUrl = c.req.url.replace(/\/openapi\.json.*$/, '');
    return c.json({
      openapi: '3.0.0',
      info: { title: 'SalesOps API', version: '0.0.0' },
      servers: [{ url: baseUrl }],
      paths: {
        '/health': { get: { summary: 'Health check', responses: { 200: { description: 'OK' } } } },
        '/priceHistory': { get: { summary: 'List price history', responses: { 200: { description: 'OK' } } }, post: { summary: 'Create SKU price change', responses: { 201: { description: 'Created' } } } },
        '/priceHistory/{id}': { get: { summary: 'Get by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } } },
        '/inventoryAdjustments': { get: { summary: 'List inventory adjustments', responses: { 200: { description: 'OK' } } }, post: { summary: 'Create adjustment', responses: { 201: { description: 'Created' }, 400: { description: 'Bad Request' } } } },
        '/inventoryAdjustments/{id}': { get: { summary: 'Get by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } } },
        '/products': { get: { summary: 'List products', responses: { 200: { description: 'OK' } } }, post: { summary: 'Create product', responses: { 201: { description: 'Created' } } } },
        '/products/{id}': { get: { summary: 'Get by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } }, patch: { summary: 'Update product', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } }, delete: { summary: 'Delete product', responses: { 204: { description: 'No Content' }, 404: { description: 'Not Found' } } } },
        '/users': { get: { summary: 'List users', responses: { 200: { description: 'OK' } } }, post: { summary: 'Create user', responses: { 201: { description: 'Created' } } } },
        '/users/{id}': { get: { summary: 'Get by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } }, patch: { summary: 'Update user', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } }, delete: { summary: 'Delete user', responses: { 204: { description: 'No Content' }, 404: { description: 'Not Found' } } } },
      },
    });
  });

export { api };
export type AppType = typeof api;
