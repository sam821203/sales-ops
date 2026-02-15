import {
  discountTypeValues,
  inventoryAdjustmentTypeValues,
  orderStatusValues,
  paymentMethodValues,
  paymentStatusValues,
  paymentTransactionStatusValues,
  productStatusValues,
  promotionStatusValues,
  refundStatusValues,
} from '@salesops/shared';
import { describe, expect, it } from 'vitest';
import {
  discountTypeMap,
  inventoryAdjustmentTypeMap,
  orderStatusMap,
  paymentMethodMap,
  paymentStatusMap,
  paymentTransactionStatusMap,
  productStatusMap,
  promotionStatusMap,
  refundStatusMap,
} from './enum.mapper.js';

function sorted(values: readonly string[]): string[] {
  return [...values].sort();
}

describe('ecommerce enum mappings', () => {
  it('stays consistent with shared product statuses', () => {
    expect(sorted(Object.values(productStatusMap))).toEqual(sorted(productStatusValues));
  });

  it('stays consistent with shared discount types', () => {
    expect(sorted(Object.values(discountTypeMap))).toEqual(sorted(discountTypeValues));
  });

  it('stays consistent with shared order statuses', () => {
    expect(sorted(Object.values(orderStatusMap))).toEqual(sorted(orderStatusValues));
  });

  it('stays consistent with shared payment statuses', () => {
    expect(sorted(Object.values(paymentStatusMap))).toEqual(sorted(paymentStatusValues));
  });

  it('stays consistent with shared inventory adjustment types', () => {
    expect(sorted(Object.values(inventoryAdjustmentTypeMap))).toEqual(
      sorted(inventoryAdjustmentTypeValues),
    );
  });

  it('stays consistent with shared payment methods', () => {
    expect(sorted(Object.values(paymentMethodMap))).toEqual(sorted(paymentMethodValues));
  });

  it('stays consistent with shared payment transaction statuses', () => {
    expect(sorted(Object.values(paymentTransactionStatusMap))).toEqual(
      sorted(paymentTransactionStatusValues),
    );
  });

  it('stays consistent with shared promotion statuses', () => {
    expect(sorted(Object.values(promotionStatusMap))).toEqual(sorted(promotionStatusValues));
  });

  it('stays consistent with shared refund statuses', () => {
    expect(sorted(Object.values(refundStatusMap))).toEqual(sorted(refundStatusValues));
  });
});
