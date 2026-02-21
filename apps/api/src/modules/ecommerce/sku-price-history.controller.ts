import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createSkuPriceHistorySchema,
  listPriceHistoryQuerySchema,
  priceHistoryIdParamSchema,
} from './dto/ecommerce.dto.js';
import { SkuNotFoundError } from './sku-price-history.service.js';
import { skuPriceHistoryService } from './sku-price-history.service.js';

const priceHistory = new Hono();

// GET /priceHistory
priceHistory.get('/', zValidator('query', listPriceHistoryQuerySchema), async (c) => {
  const { page, pageSize, q } = c.req.valid('query');
  const list = await skuPriceHistoryService.getList(page, pageSize, { q });
  return c.json(list);
});

// GET /priceHistory/:id
priceHistory.get('/:id', zValidator('param', priceHistoryIdParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const item = await skuPriceHistoryService.getById(id);
  if (!item) {
    return c.json({ error: 'Not Found', message: 'Price history not found' }, 404);
  }
  return c.json(item);
});

// POST /priceHistory
priceHistory.post('/', zValidator('json', createSkuPriceHistorySchema), async (c) => {
  try {
    const body = c.req.valid('json');
    const created = await skuPriceHistoryService.create(body);
    return c.json(created, 201);
  } catch (e) {
    if (e instanceof SkuNotFoundError) {
      return c.json({ error: 'Bad Request', message: e.message }, 400);
    }
    throw e;
  }
});

export { priceHistory as skuPriceHistoryController };
