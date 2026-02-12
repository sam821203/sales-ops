import { Button, Card } from 'antd';

export function ButtonsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-title-md2 font-semibold text-black dark:text-white">Buttons</h1>
      <Card className="shadow-1">
        <div className="flex flex-wrap gap-3">
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="text">Text</Button>
          <Button type="link">Link</Button>
        </div>
      </Card>
    </div>
  );
}

