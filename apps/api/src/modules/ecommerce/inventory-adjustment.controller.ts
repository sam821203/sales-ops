import type { Context } from 'hono';
import type { z } from 'zod';
import {
  createInventoryAdjustmentSchema,
  listInventoryAdjustmentsQuerySchema,
  inventoryAdjustmentIdParamSchema,
} from './dto/ecommerce.dto.js';
import {
  InsufficientStockError,
  SkuNotFoundError,
} from './inventory-adjustment.service.js';
import { inventoryAdjustmentService } from './inventory-adjustment.service.js';

export {
  createInventoryAdjustmentSchema,
  listInventoryAdjustmentsQuerySchema,
  inventoryAdjustmentIdParamSchema,
};

type ListQuery = z.infer<typeof listInventoryAdjustmentsQuerySchema>;
type ParamId = z.infer<typeof inventoryAdjustmentIdParamSchema>;
type CreateBody = z.infer<typeof createInventoryAdjustmentSchema>;

export const listInventoryAdjustmentsHandler = async (c: Context<object, string, { out: { query: ListQuery } }>) => {
  const { page, pageSize, q } = c.req.valid('query');
  const list = await inventoryAdjustmentService.getList(page, pageSize, { q });
  return c.json(list);
};

export const getInventoryAdjustmentByIdHandler = async (c: Context<object, string, { out: { param: ParamId } }>) => {
  const { id } = c.req.valid('param');
  const item = await inventoryAdjustmentService.getById(id);
  if (!item) {
    return c.json(
      { error: 'Not Found', message: 'Inventory adjustment not found' },
      404
    );
  }
  return c.json(item);
};

export const createInventoryAdjustmentHandler = async (c: Context<object, string, { out: { json: CreateBody } }>) => {
  try {
    const body = c.req.valid('json');
    const created = await inventoryAdjustmentService.create(body);
    return c.json(created, 201);
  } catch (e) {
    if (
      e instanceof SkuNotFoundError ||
      e instanceof InsufficientStockError
    ) {
      return c.json({ error: 'Bad Request', message: e.message }, 400);
    }
    throw e;
  }
};
