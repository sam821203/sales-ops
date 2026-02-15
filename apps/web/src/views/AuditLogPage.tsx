import { Card } from '@/components/common/card';

export function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md2 font-semibold text-black dark:text-white">
          Audit Log
        </h1>
        <p className="text-body dark:text-bodydark">
          Review system activities and operation trails.
        </p>
      </div>

      <Card title="Audit Log" description="API integration pending.">
        <p className="text-sm text-body dark:text-bodydark2">
          Operator actions, timestamps, and changed fields will appear here.
        </p>
      </Card>
    </div>
  );
}
