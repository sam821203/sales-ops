/** Values for inventory adjustment type (e.g. dropdown options). */
export const inventoryAdjustmentTypeValues = ['Increase', 'Decrease'] as const;
export type InventoryAdjustmentType = (typeof inventoryAdjustmentTypeValues)[number];
