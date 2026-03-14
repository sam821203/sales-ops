import { z } from 'zod';
import { OpenAPIHono, createRoute, type RouteHandler } from '@hono/zod-openapi';
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
  updateUserSchema,
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

// Route definitions (extracted so we can type handlers with RouteHandler<typeof route>)
const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  responses: { 200: { description: 'OK', content: { 'application/json': { schema: jsonObjectSchema } } } },
});
const healthLiveRoute = createRoute({
  method: 'get',
  path: '/health/live',
  responses: { 200: { description: 'Liveness probe', content: { 'application/json': { schema: jsonObjectSchema } } } },
});
const listPriceHistoryRoute = createRoute({
  method: 'get',
  path: '/priceHistory',
  request: { query: listPriceHistoryQuerySchema },
  responses: { 200: { description: 'OK', content: { 'application/json': { schema: listPriceHistoryResponseSchema } } } },
});
const getPriceHistoryByIdRoute = createRoute({
  method: 'get',
  path: '/priceHistory/{id}',
  request: { params: priceHistoryIdParamSchema },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: skuPriceHistoryListItemSchema } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const createPriceHistoryRoute = createRoute({
  method: 'post',
  path: '/priceHistory',
  request: { body: { content: { 'application/json': { schema: createSkuPriceHistorySchema } } } },
  responses: { 201: { description: 'Created', content: { 'application/json': { schema: skuPriceHistoryListItemSchema } } } },
});
const listInventoryAdjustmentsRoute = createRoute({
  method: 'get',
  path: '/inventoryAdjustments',
  request: { query: listInventoryAdjustmentsQuerySchema },
  responses: { 200: { description: 'OK', content: { 'application/json': { schema: listInventoryAdjustmentsResponseSchema } } } },
});
const getInventoryAdjustmentByIdRoute = createRoute({
  method: 'get',
  path: '/inventoryAdjustments/{id}',
  request: { params: inventoryAdjustmentIdParamSchema },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: inventoryAdjustmentListItemSchema } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const createInventoryAdjustmentRoute = createRoute({
  method: 'post',
  path: '/inventoryAdjustments',
  request: { body: { content: { 'application/json': { schema: createInventoryAdjustmentSchema } } } },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: inventoryAdjustmentListItemSchema } } },
    400: { description: 'Bad Request', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const listProductsRoute = createRoute({
  method: 'get',
  path: '/products',
  request: { query: listProductsQuerySchema },
  responses: { 200: { description: 'OK', content: { 'application/json': { schema: listProductsResponseSchema } } } },
});
const getProductByIdRoute = createRoute({
  method: 'get',
  path: '/products/{id}',
  request: { params: productIdParamSchema },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: productSchema } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const createProductRoute = createRoute({
  method: 'post',
  path: '/products',
  request: { body: { content: { 'application/json': { schema: createProductSchema } } } },
  responses: { 201: { description: 'Created', content: { 'application/json': { schema: productSchema } } } },
});
const updateProductRoute = createRoute({
  method: 'patch',
  path: '/products/{id}',
  request: { params: productIdParamSchema, body: { content: { 'application/json': { schema: updateProductSchema } } } },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: productSchema } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const deleteProductRoute = createRoute({
  method: 'delete',
  path: '/products/{id}',
  request: { params: productIdParamSchema },
  responses: {
    204: { description: 'No Content' },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const uploadRoute = createRoute({
  method: 'post',
  path: '/upload',
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ url: z.string() }) } } },
    400: { description: 'Bad Request', content: { 'application/json': { schema: jsonObjectSchema } } },
    502: { description: 'Bad Gateway', content: { 'application/json': { schema: jsonObjectSchema } } },
    503: { description: 'Service Unavailable', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const listUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  responses: { 200: { description: 'OK', content: { 'application/json': { schema: listUsersResponseSchema } } } },
});
const getUserByIdRoute = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: { params: userIdParamSchema },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: userResponseSchema } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  request: { body: { content: { 'application/json': { schema: createUserSchema } } } },
  responses: { 201: { description: 'Created', content: { 'application/json': { schema: userResponseSchema } } } },
});
const updateUserRoute = createRoute({
  method: 'patch',
  path: '/users/{id}',
  request: { params: userIdParamSchema, body: { content: { 'application/json': { schema: updateUserSchema } } } },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: userResponseSchema } } },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});
const deleteUserRoute = createRoute({
  method: 'delete',
  path: '/users/{id}',
  request: { params: userIdParamSchema },
  responses: {
    204: { description: 'No Content' },
    404: { description: 'Not Found', content: { 'application/json': { schema: jsonObjectSchema } } },
  },
});

// Single OpenAPIHono with one continuous chain so RPC schema is preserved for hc<AppType>.
const api = new OpenAPIHono()
  .openapi(healthRoute, healthHandler as unknown as RouteHandler<typeof healthRoute>)
  .openapi(healthLiveRoute, healthLiveHandler as unknown as RouteHandler<typeof healthLiveRoute>)
  .openapi(listPriceHistoryRoute, listPriceHistoryHandler as RouteHandler<typeof listPriceHistoryRoute>)
  .openapi(getPriceHistoryByIdRoute, getPriceHistoryByIdHandler as RouteHandler<typeof getPriceHistoryByIdRoute>)
  .openapi(createPriceHistoryRoute, createPriceHistoryHandler as RouteHandler<typeof createPriceHistoryRoute>)
  .openapi(listInventoryAdjustmentsRoute, listInventoryAdjustmentsHandler as RouteHandler<typeof listInventoryAdjustmentsRoute>)
  .openapi(getInventoryAdjustmentByIdRoute, getInventoryAdjustmentByIdHandler as RouteHandler<typeof getInventoryAdjustmentByIdRoute>)
  .openapi(createInventoryAdjustmentRoute, createInventoryAdjustmentHandler as RouteHandler<typeof createInventoryAdjustmentRoute>)
  .openapi(listProductsRoute, listProductsHandler as RouteHandler<typeof listProductsRoute>)
  .openapi(getProductByIdRoute, getProductByIdHandler as RouteHandler<typeof getProductByIdRoute>)
  .openapi(createProductRoute, createProductHandler as RouteHandler<typeof createProductRoute>)
  .openapi(updateProductRoute, updateProductHandler as RouteHandler<typeof updateProductRoute>)
  .openapi(deleteProductRoute, deleteProductHandler as RouteHandler<typeof deleteProductRoute>)
  .openapi(uploadRoute, uploadHandler as RouteHandler<typeof uploadRoute>)
  .openapi(listUsersRoute, listUsersHandler as RouteHandler<typeof listUsersRoute>)
  .openapi(getUserByIdRoute, getUserByIdHandler as RouteHandler<typeof getUserByIdRoute>)
  .openapi(createUserRoute, createUserHandler as RouteHandler<typeof createUserRoute>)
  .openapi(updateUserRoute, updateUserHandler as RouteHandler<typeof updateUserRoute>)
  .openapi(deleteUserRoute, deleteUserHandler as RouteHandler<typeof deleteUserRoute>)
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
