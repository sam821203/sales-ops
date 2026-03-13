import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
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

const inventoryAdjustments = new Hono();

// GET /inventoryAdjustments
inventoryAdjustments.get(
  '/',
  zValidator('query', listInventoryAdjustmentsQuerySchema),
  async (c) => {
    const { page, pageSize, q } = c.req.valid('query');
    const list = await inventoryAdjustmentService.getList(page, pageSize, { q });
    return c.json(list);
  }
);

// GET /inventoryAdjustments/:id
inventoryAdjustments.get(
  '/:id',
  zValidator('param', inventoryAdjustmentIdParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const item = await inventoryAdjustmentService.getById(id);
    if (!item) {
      return c.json(
        { error: 'Not Found', message: 'Inventory adjustment not found' },
        404
      );
    }
    return c.json(item);
  }
);

// POST /inventoryAdjustments
inventoryAdjustments.post(
  '/',
  zValidator('json', createInventoryAdjustmentSchema),
  async (c) => {
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
  }
);

export { inventoryAdjustments as inventoryAdjustmentController };
