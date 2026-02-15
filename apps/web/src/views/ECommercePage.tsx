import Card from '../components/common/Card';
import type { OrderStatus } from '@salesops/shared';

const defaultOrderStatus: OrderStatus = 'Created';

export function ECommercePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          eCommerce
        </h1>
        <p className="text-body dark:text-bodydark">
          Dashboard child route. Current order status: {defaultOrderStatus}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['Leads', 'Opportunities', 'Accounts', 'Revenue'].map((label) => (
          <Card key={label}>
            <p className="text-sm font-medium text-body dark:text-bodydark">
              {label}
            </p>
            <p className="mt-1 text-title-md font-semibold text-black dark:text-white">
              —
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

