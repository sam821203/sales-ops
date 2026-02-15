import { Card } from '@/components/common/card';

export function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Orders
        </h1>
        <p className="text-body dark:text-bodydark">
          Manage order lifecycle, status, and fulfillment.
        </p>
      </div>

      <Card title="Orders" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          This page will list orders with status and payment summary.
        </p>
      </Card>
    </div>
  );
}
