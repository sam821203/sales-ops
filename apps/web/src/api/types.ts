import type { InferResponseType } from 'hono/client';
import type {
  InventoryAdjustmentListItem,
  ListInventoryAdjustmentsResponse,
  ListPriceHistoryResponse as SharedListPriceHistoryResponse,
  ListProductsResponse as SharedListProductsResponse,
  Product as SharedProduct,
  SkuPriceHistoryListItem,
} from '@salesops/shared';
import { apiClient } from '@/api/client';

type Client = typeof apiClient;
export type ApiClient = Client;

// --- Helpers: request types inferred from RPC client ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- RPC client methods have specific param types
type ReqQuery<T extends (...args: any[]) => any> = NonNullable<Parameters<T>[0]> extends { query?: infer Q } ? NonNullable<Q> : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- RPC client methods have specific param types
type ReqJson<T extends (...args: any[]) => any> = NonNullable<Parameters<T>[0]> extends { json?: infer J } ? NonNullable<J> : never;

// --- Products (response: shared; request: RPC-inferred) ---
export type ProductsListResponse = SharedListProductsResponse;
export type ProductListItem = SharedProduct;
export type ProductsDetailResponse = SharedProduct | null;

export type ListProductsQuery = ReqQuery<Client['products']['$get']>;
export type ProductsCreateBody = ReqJson<Client['products']['$post']>;
export type ProductsUpdateBody = Partial<ProductsCreateBody>;
export type ProductSkuItem = ProductsCreateBody['skus'] extends (infer I)[] ? I : never;
/** Aliases for consumers (RPC-inferred, same shape as shared). */
export type CreateProductInput = ProductsCreateBody;
export type UpdateProductInput = ProductsUpdateBody;
export type ProductSkuItemInput = ProductSkuItem;
export type ProductSortBy = NonNullable<ListProductsQuery['sortBy']>;

// --- Inventory adjustments (response: shared; request: RPC-inferred) ---
export type InventoryAdjustmentsListResponse = ListInventoryAdjustmentsResponse;
export type InventoryAdjustmentItem = InventoryAdjustmentListItem;
export type InventoryAdjustmentDetailResponse = InventoryAdjustmentListItem | null;

export type ListInventoryAdjustmentsQuery = ReqQuery<Client['inventoryAdjustments']['$get']>;
export type CreateInventoryAdjustmentBody = ReqJson<Client['inventoryAdjustments']['$post']>;
export type CreateInventoryAdjustmentInput = CreateInventoryAdjustmentBody;

// --- Price history (response: shared; request: RPC-inferred) ---
export type PriceHistoryListResponse = SharedListPriceHistoryResponse;
export type PriceHistoryItem = SkuPriceHistoryListItem;
export type PriceHistoryDetailResponse = SkuPriceHistoryListItem | null;

export type ListPriceHistoryQuery = ReqQuery<Client['priceHistory']['$get']>;
export type CreatePriceHistoryBody = ReqJson<Client['priceHistory']['$post']>;
export type CreateSkuPriceHistoryInput = CreatePriceHistoryBody;

// --- Upload ---
export type UploadResponse = InferResponseType<Client['upload']['$post']>;
