import Card from '@/components/common/Card';

export function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Promotions
        </h1>
        <p className="text-body dark:text-bodydark">
          Create and manage campaign rules.
        </p>
      </div>

      <Card title="Promotions" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          Promotion setup and targeting configuration will be added here.
        </p>
      </Card>
    </div>
  );
}
