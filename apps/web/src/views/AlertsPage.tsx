import { Alert, Card } from 'antd';

export function AlertsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-title-md2 font-semibold text-black dark:text-white">Alerts</h1>
      <Card className="shadow-1 space-y-3">
        <Alert message="Info" type="info" showIcon />
        <Alert message="Success" type="success" showIcon />
        <Alert message="Warning" type="warning" showIcon />
        <Alert message="Error" type="error" showIcon />
      </Card>
    </div>
  );
}

