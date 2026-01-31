import { Card, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';

type Row = { key: string; name: string; stage: string; owner: string };

const columns: TableColumnsType<Row> = [
  { title: 'Name', dataIndex: 'name' },
  {
    title: 'Stage',
    dataIndex: 'stage',
    render: (stage: string) => <Tag color="blue">{stage}</Tag>,
  },
  { title: 'Owner', dataIndex: 'owner' },
];

const data: Row[] = [
  { key: '1', name: 'Acme Corp', stage: 'Qualified', owner: 'Alice' },
  { key: '2', name: 'Globex', stage: 'Proposal', owner: 'Bob' },
  { key: '3', name: 'Initech', stage: 'Negotiation', owner: 'Chris' },
];

export function DashboardCrmPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">CRM</h1>
        <p className="text-body dark:text-bodydark">Dashboard demo route.</p>
      </div>

      <Card className="shadow-default">
        <Table<Row> columns={columns} dataSource={data} pagination={false} size="middle" />
      </Card>
    </div>
  );
}

