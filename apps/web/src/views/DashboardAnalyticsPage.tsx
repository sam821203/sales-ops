import { Card, Statistic } from 'antd';

export function DashboardAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Analytics
        </h1>
        <p className="text-body dark:text-bodydark">Dashboard demo route.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Visitors', value: 12840 },
          { title: 'Sessions', value: 9340 },
          { title: 'Bounce rate', value: 42 },
          { title: 'Conversion', value: 3.4 },
        ].map((s) => (
          <Card key={s.title} className="shadow-default">
            <Statistic title={s.title} value={s.value} />
          </Card>
        ))}
      </div>
    </div>
  );
}

