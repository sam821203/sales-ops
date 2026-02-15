import { Card } from '@/components/common/card';

export function PriceHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Price History
        </h1>
        <p className="text-body dark:text-bodydark">
          Track historical price changes for products and SKUs.
        </p>
      </div>

      <Card title="Price History" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          Add filters, timeline, and change reason fields after backend is ready.
        </p>
      </Card>
    </div>
  );
}
