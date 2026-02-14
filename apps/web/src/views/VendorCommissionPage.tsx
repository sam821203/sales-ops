import Card from '@/components/common/Card';

export function VendorCommissionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Vendor Commission
        </h1>
        <p className="text-body dark:text-bodydark">
          Track settlement and commission records by vendor.
        </p>
      </div>

      <Card title="Vendor Commission" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          Commission rates and settlement history will be managed here.
        </p>
      </Card>
    </div>
  );
}
