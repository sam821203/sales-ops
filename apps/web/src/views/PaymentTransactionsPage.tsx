import { Card } from '@/components/common/card';

export function PaymentTransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Payment Transactions
        </h1>
        <p className="text-body dark:text-bodydark">
          View payment records and transaction statuses.
        </p>
      </div>

      <Card title="Payment Transactions" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          Payment gateways, statuses, and reconciliation info will be displayed here.
        </p>
      </Card>
    </div>
  );
}
