import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { env } from './config/index.js';
import { errorHandler } from './common/filters/error-handler.js';
import { requestLogger } from './common/interceptors/logging.js';
import { healthController } from './modules/health/health.controller.js';
import { skuPriceHistoryController } from './modules/ecommerce/sku-price-history.controller.js';
import { inventoryAdjustmentController } from './modules/ecommerce/inventory-adjustment.controller.js';
import { productController } from './modules/ecommerce/product.controller.js';
import { uploadController } from './modules/upload/upload.controller.js';
import { userController } from './modules/user/user.controller.js';

const app = new Hono({ strict: false });

// Global middleware: CORS first (handles preflight), then logging
app.use('*', cors({ origin: env.CORS_ORIGIN ?? '*' }));
app.use('*', requestLogger);

// API sub-app: routes are /health, /products, /users (mounted at API_PREFIX in app.route below)
const api = new Hono();

// RESTful routes
api.route('/health', healthController);
api.route('/priceHistory', skuPriceHistoryController);
api.route('/inventoryAdjustments', inventoryAdjustmentController);
api.route('/products', productController);
api.route('/upload', uploadController);
api.route('/users', userController);

// OpenAPI doc (static contract; extend with @hono/zod-openapi if needed)
api.get('/openapi.json', (c) => {
  const baseUrl = c.req.url.replace(/\/openapi\.json.*$/, '');
  return c.json({
    openapi: '3.0.0',
    info: { title: 'SalesOps API', version: '0.0.0' },
    servers: [{ url: baseUrl }],
    paths: {
      '/health': {
        get: { summary: 'Health check', responses: { 200: { description: 'OK' } } },
      },
      '/priceHistory': {
        get: { summary: 'List price history', description: 'Query: page, pageSize, q (optional search by product name or sku id). Returns { items, total }.', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create SKU price change', description: 'Body: skuId, newPrice, effectiveDate? (optional), changedBy. Records history and updates Sku.price.', responses: { 201: { description: 'Created' } } },
      },
      '/priceHistory/{id}': {
        get: { summary: 'Get price history by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
      },
      '/inventoryAdjustments': {
        get: { summary: 'List inventory adjustments', description: 'Query: page, pageSize, q (optional search by product name or sku id). Returns { items, total }.', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create inventory adjustment', description: 'Body: skuId, adjustmentType, quantity, reason, adjustedBy. Creates record and updates Sku.stock.', responses: { 201: { description: 'Created' }, 400: { description: 'Bad Request (SKU not found or insufficient stock)' } } },
      },
      '/inventoryAdjustments/{id}': {
        get: { summary: 'Get inventory adjustment by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
      },
      '/products': {
        get: { summary: 'List products', description: 'Query: page, pageSize, status (optional), sortBy, sortOrder, q (search). Returns { items, total }.', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create product', description: 'Body: name, status, skus[]', responses: { 201: { description: 'Created' } } },
      },
      '/products/{id}': {
        get: { summary: 'Get product by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        patch: { summary: 'Update product', description: 'Body: name?, status?, skus? (optional)', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        delete: { summary: 'Delete product', responses: { 204: { description: 'No Content' }, 404: { description: 'Not Found' } } },
      },
      '/users': {
        get: { summary: 'List users', responses: { 200: { description: 'OK' } } },
        post: { summary: 'Create user', responses: { 201: { description: 'Created' } } },
      },
      '/users/{id}': {
        get: { summary: 'Get user by id', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        patch: { summary: 'Update user', responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        delete: { summary: 'Delete user', responses: { 204: { description: 'No Content' }, 404: { description: 'Not Found' } } },
      },
    },
  });
});

app.route(env.API_PREFIX, api);

// 404
app.notFound((_c) => {
  throw new HTTPException(404, { message: 'Not Found' });
});

// Error handler (must be last)
app.onError((err, c) => errorHandler(err, c));

// Start server when run directly
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`API listening on http://${info.address}:${info.port}${env.API_PREFIX}`);
});

export { app };
