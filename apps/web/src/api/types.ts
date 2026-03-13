import type { InferResponseType } from 'hono/client';
import { apiClient } from '@/api/client';

type Client = typeof apiClient;
export type ApiClient = Client;

// Products — inferred from RPC
export type ProductsListResponse = InferResponseType<Client['products']['$get']>;
export type ProductListItem = ProductsListResponse['items'][number];
export type ProductsDetailResponse = Extract<
  InferResponseType<Client['products'][':id']['$get']>,
  { id: number }
>;

// Inventory adjustments
export type InventoryAdjustmentsListResponse = InferResponseType<Client['inventoryAdjustments']['$get']>;
export type InventoryAdjustmentItem = InventoryAdjustmentsListResponse['items'][number];
export type InventoryAdjustmentDetailResponse = Extract<
  InferResponseType<Client['inventoryAdjustments'][':id']['$get']>,
  { id: number }
>;

// Price history
export type PriceHistoryListResponse = InferResponseType<Client['priceHistory']['$get']>;
export type PriceHistoryItem = PriceHistoryListResponse['items'][number];
export type PriceHistoryDetailResponse = Extract<
  InferResponseType<Client['priceHistory'][':id']['$get']>,
  { id: number }
>;

// Upload
export type UploadResponse = InferResponseType<Client['upload']['$post']>;
