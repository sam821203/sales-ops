import { Card } from '@/components/common/Card';
import { PageBreadcrumb } from '@/components/common/breadcrumb';

export function AuditLogPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageBreadcrumb pageTitle="Audit Log" />
      <Card title="Audit Log" description="View system audit history.">
        <p className="text-sm text-body dark:text-bodydark2">
          Audit log content will be displayed here.
        </p>
      </Card>
    </div>
  );
}
