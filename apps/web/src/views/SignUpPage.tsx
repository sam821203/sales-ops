import { Button, Card, Form, Input } from 'antd';

export function SignUpPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-title-md2 font-semibold text-black dark:text-white">Sign Up</h1>
      <Card className="shadow-1">
        <Form layout="vertical">
          <Form.Item label="Email" name="email">
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create account
          </Button>
        </Form>
      </Card>
    </div>
  );
}

