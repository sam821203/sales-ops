import { z } from 'zod';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
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
  listPriceHistoryResponseSchema,
  listProductsResponseSchema,
  productSchema,
  listInventoryAdjustmentsResponseSchema,
  inventoryAdjustmentListItemSchema,
  skuPriceHistoryListItemSchema,
} from './modules/ecommerce/dto/ecommerce.dto.js';
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
  userResponseSchema,
  listUsersResponseSchema,
} from './modules/user/dto/user-response.dto.js';
import {
  createUserSchema,
  listUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from './modules/user/user.controller.js';

// Generic response schemas for routes that return arbitrary JSON
const jsonObjectSchema = z.record(z.unknown());

// Param schema for user routes (id is string)
const userIdParamSchema = z.object({ id: z.string() });

// Single OpenAPIHono with one continuous chain so RPC schema is preserved for hc<AppType>.
// Handlers cast below: openapi() infers response as never for generic response schemas; cast is required.
/* eslint-disable @typescript-eslint/no-explicit-any -- see comment above */
const api = new OpenAPIHono()
  // Health
  .openapi(
    createRoute({ method: 'get', path: '/health', responses: { 200: { description: 'OK', content: { 'application/json': { schema: jsonObjectSchema } } } } }),
    healthHandler as any
  )
  .openapi(
    createRoute({ method: 'get', path: '/health/live', responses: { 200: { description: 'Liveness probe', content: { 'application/json': { schema: jsonObjectSchema } } } } }),
    healthLiveHandler as any
  )
  // Price history
  .openapi(
    createRoute({
      method: 'get',
      path: '/priceHistory',
      request: { query: listPriceHistoryQuerySchema },
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: listPriceHistoryResponseSchema } } } },
    }),
    listPriceHistoryHandler as any
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/priceHistory/{id}',
      request: { params: priceHistoryIdParamSchema },
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: skuPriceHistoryListItemSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    getPriceHistoryByIdHandler as any
  )
  .openapi(
    createRoute({
      method: 'post',
      path: '/priceHistory',
      request: { body: { content: { 'application/json': { schema: createSkuPriceHistorySchema } } } },
      responses: { 201: { description: 'Created', content: { 'application/json': { schema: skuPriceHistoryListItemSchema } } } },
    }),
    createPriceHistoryHandler as any
  )
  // Inventory adjustments
  .openapi(
    createRoute({
      method: 'get',
      path: '/inventoryAdjustments',
      request: { query: listInventoryAdjustmentsQuerySchema },
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: listInventoryAdjustmentsResponseSchema } } } },
    }),
    listInventoryAdjustmentsHandler as any
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/inventoryAdjustments/{id}',
      request: { params: inventoryAdjustmentIdParamSchema },
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: inventoryAdjustmentListItemSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    getInventoryAdjustmentByIdHandler as any
  )
  .openapi(
    createRoute({
      method: 'post',
      path: '/inventoryAdjustments',
      request: { body: { content: { 'application/json': { schema: createInventoryAdjustmentSchema } } } },
      responses: {
        201: { description: 'Created', content: { 'application/json': { schema: inventoryAdjustmentListItemSchema } } },
        400: { description: 'Bad Request', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    createInventoryAdjustmentHandler as any
  )
  // Products
  .openapi(
    createRoute({
      method: 'get',
      path: '/products',
      request: { query: listProductsQuerySchema },
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: listProductsResponseSchema } } } },
    }),
    listProductsHandler as any
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/products/{id}',
      request: { params: productIdParamSchema },
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: productSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    getProductByIdHandler as any
  )
  .openapi(
    createRoute({
      method: 'post',
      path: '/products',
      request: { body: { content: { 'application/json': { schema: createProductSchema } } } },
      responses: { 201: { description: 'Created', content: { 'application/json': { schema: productSchema } } } },
    }),
    createProductHandler as any
  )
  .openapi(
    createRoute({
      method: 'patch',
      path: '/products/{id}',
      request: { params: productIdParamSchema, body: { content: { 'application/json': { schema: updateProductSchema } } } },
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: productSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    updateProductHandler as any
  )
  .openapi(
    createRoute({
      method: 'delete',
      path: '/products/{id}',
      request: { params: productIdParamSchema },
      responses: {
        204: { description: 'No Content' },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    deleteProductHandler as any
  )
  // Upload
  .openapi(
    createRoute({
      method: 'post',
      path: '/upload',
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: z.object({ url: z.string() }) } } },
        400: { description: 'Bad Request', content: { 'application/json': { schema: jsonObjectSchema } } },
        502: { description: 'Bad Gateway', content: { 'application/json': { schema: jsonObjectSchema } } },
        503: { description: 'Service Unavailable', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    uploadHandler as any
  )
  // Users
  .openapi(
    createRoute({
      method: 'get',
      path: '/users',
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: listUsersResponseSchema } } } },
    }),
    listUsersHandler as any
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/users/{id}',
      request: { params: userIdParamSchema },
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: userResponseSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    getUserByIdHandler as any
  )
  .openapi(
    createRoute({
      method: 'post',
      path: '/users',
      request: { body: { content: { 'application/json': { schema: createUserSchema } } } },
      responses: { 201: { description: 'Created', content: { 'application/json': { schema: userResponseSchema } } } },
    }),
    createUserHandler as any
  )
  .openapi(
    createRoute({
      method: 'patch',
      path: '/users/{id}',
      request: { params: userIdParamSchema },
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: userResponseSchema } } },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    updateUserHandler as any
  )
  .openapi(
    createRoute({
      method: 'delete',
      path: '/users/{id}',
      request: { params: userIdParamSchema },
      responses: {
        204: { description: 'No Content' },
        404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
      },
    }),
    deleteUserHandler as any
  )
  /* eslint-enable @typescript-eslint/no-explicit-any */
  .doc('/openapi.json', (c) => {
    const baseUrl = c.req.url.replace(/\/openapi\.json.*$/, '');
    return {
      openapi: '3.0.0',
      info: { title: 'SalesOps API', version: '0.0.0' },
      servers: [{ url: baseUrl }],
    };
  });

export { api };
export type AppType = typeof api;
