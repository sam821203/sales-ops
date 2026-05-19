import type {
  CreateSkuPriceHistoryInput,
  ListPriceHistoryResponse,
  SkuPriceHistoryListItem,
} from './dto/ecommerce.dto.js';
import {
  PRICE_UNCHANGED,
  skuPriceHistoryRepository,
} from './sku-price-history.repository.js';

export class SkuNotFoundError extends Error {
  constructor(message: string = 'SKU not found') {
    super(message);
    this.name = 'SkuNotFoundError';
  }
}

export class PriceUnchangedError extends Error {
  constructor(message: string = 'Price unchanged') {
    super(message);
    this.name = 'PriceUnchangedError';
  }
}

type PrismaRow = Awaited<
  ReturnType<typeof skuPriceHistoryRepository.findById>
>;
type PrismaRowNonNull = NonNullable<PrismaRow>;

const isStringRecord = (v: unknown): v is Record<string, string> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v).every((x) => typeof x === 'string');

const toListItem = (row: PrismaRowNonNull): SkuPriceHistoryListItem => {
  const attrs = row.sku.attributes;
  const skuAttributes = isStringRecord(attrs) ? attrs : {};
  return {
    id: row.id,
    skuId: row.skuId,
    oldPrice: row.oldPrice,
    newPrice: row.newPrice,
    effectiveDate:
      row.effectiveDate instanceof Date
        ? row.effectiveDate.toISOString()
        : new Date(row.effectiveDate).toISOString(),
    changedBy: row.changedBy,
    productName: row.sku.product.name,
    productId: row.sku.productId,
    skuAttributes,
  };
};

/**
 * Business logic only. No HTTP/framework types.
 */
export const skuPriceHistoryService = {
  async getList(
    page: number,
    pageSize: number,
    options: { q?: string }
  ): Promise<ListPriceHistoryResponse> {
    const { items, total } = await skuPriceHistoryRepository.findManyAndCount(
      page,
      pageSize,
      options
    );
    return { items: items.map(toListItem), total };
  },

  async getById(id: number): Promise<SkuPriceHistoryListItem | null> {
    const row = await skuPriceHistoryRepository.findById(id);
    return row ? toListItem(row) : null;
  },

  async create(data: CreateSkuPriceHistoryInput): Promise<SkuPriceHistoryListItem> {
    const row = await skuPriceHistoryRepository.create(data);
    if (row === null) throw new SkuNotFoundError(`SKU with ID ${data.skuId} does not exist.`);
    if (row === PRICE_UNCHANGED) {
      throw new PriceUnchangedError(
        `SKU ${data.skuId} price is already ${data.newPrice}. No history record created.`
      );
    }
    return toListItem(row);
  },
};
