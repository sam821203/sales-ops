import type { Context } from 'hono';
import type { z } from 'zod';
import {
  createSkuPriceHistorySchema,
  listPriceHistoryQuerySchema,
  priceHistoryIdParamSchema,
} from './dto/ecommerce.dto.js';
import {
  PriceUnchangedError,
  SkuNotFoundError,
} from './sku-price-history.service.js';
import { skuPriceHistoryService } from './sku-price-history.service.js';

export {
  createSkuPriceHistorySchema,
  listPriceHistoryQuerySchema,
  priceHistoryIdParamSchema,
};

type ListQuery = z.infer<typeof listPriceHistoryQuerySchema>;
type ParamId = z.infer<typeof priceHistoryIdParamSchema>;
type CreateBody = z.infer<typeof createSkuPriceHistorySchema>;

export async function listPriceHistoryHandler(c: Context<object, string, { out: { query: ListQuery } }>) {
  const { page, pageSize, q } = c.req.valid('query');
  const list = await skuPriceHistoryService.getList(page, pageSize, { q });
  return c.json(list);
}

export async function getPriceHistoryByIdHandler(c: Context<object, string, { out: { param: ParamId } }>) {
  const { id } = c.req.valid('param');
  const item = await skuPriceHistoryService.getById(id);
  if (!item) {
    return c.json({ error: 'Not Found', message: 'Price history not found' }, 404);
  }
  return c.json(item);
}

export async function createPriceHistoryHandler(c: Context<object, string, { out: { json: CreateBody } }>) {
  try {
    const body = c.req.valid('json');
    const created = await skuPriceHistoryService.create(body);
    return c.json(created, 201);
  } catch (e) {
    if (e instanceof SkuNotFoundError || e instanceof PriceUnchangedError) {
      return c.json({ error: 'Bad Request', message: e.message }, 400);
    }
    throw e;
  }
}
