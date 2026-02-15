import { Card } from '@/components/common/Card';

export function OrderStatusHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Order Status History
        </h1>
        <p className="text-body dark:text-bodydark">
          Review order status transitions over time.
        </p>
      </div>

      <Card title="Order Status History" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          Status events and timeline details will be loaded from the backend.
        </p>
      </Card>
    </div>
  );
}
