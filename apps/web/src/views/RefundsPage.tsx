import { Card } from '@/components/common/card';

export function RefundsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Refunds
        </h1>
        <p className="text-body dark:text-bodydark">
          Manage refund requests and refund statuses.
        </p>
      </div>

      <Card title="Refunds" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          Refund workflows and payment rollback details will be added here.
        </p>
      </Card>
    </div>
  );
}
