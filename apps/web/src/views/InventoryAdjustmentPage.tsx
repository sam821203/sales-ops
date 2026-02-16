import { Card } from '@/components/common/Card';
import { PageBreadcrumb } from '@/components/common/breadcrumb';

export function InventoryAdjustmentPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageBreadcrumb pageTitle="Inventory Adjustment" />
      <Card
        title="Inventory Adjustment"
        description="Adjust stock levels for your products."
      >
        <p className="text-sm text-body dark:text-bodydark2">
          Inventory adjustment content will be displayed here.
        </p>
      </Card>
    </div>
  );
}
