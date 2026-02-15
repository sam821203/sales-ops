import { Card } from '@/components/common/card';

export function PromotionStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Promotion Status
        </h1>
        <p className="text-body dark:text-bodydark">
          Monitor promotion lifecycle and active states.
        </p>
      </div>

      <Card title="Promotion Status" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          This page will show active, scheduled, and expired promotions.
        </p>
      </Card>
    </div>
  );
}
