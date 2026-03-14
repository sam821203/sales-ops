import type { InferResponseType } from 'hono/client';
import type { RpcClient } from '@/api/client';

type Client = RpcClient;
export type ApiClient = Client;

// --- Helpers: request types inferred from RPC client ---
type ReqQuery<T extends (...args: never) => unknown> = NonNullable<Parameters<T>[0]> extends { query?: infer Q } ? NonNullable<Q> : never;
type ReqJson<T extends (...args: never) => unknown> = NonNullable<Parameters<T>[0]> extends { json?: infer J } ? NonNullable<J> : never;

// --- Products (all RPC-inferred) ---
export type ProductsListResponse = InferResponseType<Client['products']['$get']>;
export type ProductListItem = ProductsListResponse['items'][number];
export type ProductsDetailResponse = InferResponseType<Client['products'][':id']['$get']>;

export type ListProductsQuery = ReqQuery<Client['products']['$get']>;
export type ProductsCreateBody = ReqJson<Client['products']['$post']>;
export type ProductsUpdateBody = Partial<ProductsCreateBody>;
export type ProductSkuItem = ProductsCreateBody['skus'] extends (infer I)[] ? I : never;
export type CreateProductInput = ProductsCreateBody;
export type UpdateProductInput = ProductsUpdateBody;
export type ProductSkuItemInput = ProductSkuItem;
export type ProductSortBy = NonNullable<ListProductsQuery['sortBy']>;
export type ProductStatus = ProductListItem['status'];
export type SKU = ProductListItem['skus'][number];

/** Order processing status (e.g. eCommerce dashboard). */
export type OrderProcessingStatus = 'Created' | 'Paying' | 'Paid' | 'Failed';

// --- Inventory adjustments (all RPC-inferred) ---
export type InventoryAdjustmentsListResponse = InferResponseType<Client['inventoryAdjustments']['$get']>;
export type InventoryAdjustmentItem = InventoryAdjustmentsListResponse['items'][number];
export type InventoryAdjustmentDetailResponse = InferResponseType<Client['inventoryAdjustments'][':id']['$get']>;

export type ListInventoryAdjustmentsQuery = ReqQuery<Client['inventoryAdjustments']['$get']>;
export type CreateInventoryAdjustmentBody = ReqJson<Client['inventoryAdjustments']['$post']>;
export type CreateInventoryAdjustmentInput = CreateInventoryAdjustmentBody;

// --- Price history (all RPC-inferred) ---
export type PriceHistoryListResponse = InferResponseType<Client['priceHistory']['$get']>;
export type PriceHistoryItem = PriceHistoryListResponse['items'][number];
export type PriceHistoryDetailResponse = InferResponseType<Client['priceHistory'][':id']['$get']>;

export type ListPriceHistoryQuery = ReqQuery<Client['priceHistory']['$get']>;
export type CreatePriceHistoryBody = ReqJson<Client['priceHistory']['$post']>;
export type CreateSkuPriceHistoryInput = CreatePriceHistoryBody;

// --- Upload ---
export type UploadResponse = InferResponseType<Client['upload']['$post']>;

// --- Domain types (for mocks / non-API usage) ---
export type Category = { id: number; name: string };
export type Brand = { id: number; name: string };
