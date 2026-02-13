import Card from '@/components/common/Card';

export function InventoryAdjustmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Inventory Adjustment
        </h1>
        <p className="text-body dark:text-bodydark">
          Record stock changes and adjustment reasons.
        </p>
      </div>

      <Card title="Inventory Adjustment" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          This area will support stock in/out operations and audit traces.
        </p>
      </Card>
    </div>
  );
}
