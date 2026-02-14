import Card from '@/components/common/Card';

export function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Products
        </h1>
        <p className="text-body dark:text-bodydark">
          Product list and management overview.
        </p>
      </div>

      <Card title="Products" description="Data source will be connected to API later.">
        <p className="text-sm text-body dark:text-bodydark2">
          This page is ready for products listing and editing workflows.
        </p>
      </Card>
    </div>
  );
}
