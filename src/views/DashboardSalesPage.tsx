import { Card, Progress } from 'antd';

export function DashboardSalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">Sales</h1>
        <p className="text-body dark:text-bodydark">Dashboard demo route.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-default" title="Quota attainment">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-body dark:text-bodydark">Team A</p>
              <Progress percent={72} />
            </div>
            <div>
              <p className="mb-2 text-sm text-body dark:text-bodydark">Team B</p>
              <Progress percent={58} status="active" />
            </div>
          </div>
        </Card>

        <Card className="shadow-default" title="Pipeline health">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-body dark:text-bodydark">Coverage</span>
              <span className="font-medium text-black dark:text-white">3.2×</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-body dark:text-bodydark">Win rate</span>
              <span className="font-medium text-black dark:text-white">24%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-body dark:text-bodydark">Avg cycle</span>
              <span className="font-medium text-black dark:text-white">31d</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

