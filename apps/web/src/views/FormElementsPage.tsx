import { Card, Form, Input, Select } from 'antd';

export function FormElementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-title-md2 font-semibold text-black dark:text-white">
        Form Elements
      </h1>
      <Card className="shadow-1">
        <Form layout="vertical">
          <Form.Item label="Name" name="name">
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

