import { Button, Card, DatePicker, Space } from 'antd';

export function DashboardReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">Reports</h1>
        <p className="text-body dark:text-bodydark">Dashboard demo route.</p>
      </div>

      <Card className="shadow-default" title="Report generator">
        <Space wrap>
          <DatePicker.RangePicker />
          <Button type="primary">Generate</Button>
          <Button>Export CSV</Button>
        </Space>
      </Card>
    </div>
  );
}

