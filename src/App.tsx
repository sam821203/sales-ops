import { Layout, Typography, Menu } from 'antd';
import { Outlet, Link } from '@tanstack/react-router';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="text-white text-center py-4 text-xl font-semibold">
          SalesOps
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: 'dashboard',
              label: <Link to="/">Dashboard</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', paddingInline: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            SalesOps Frontend
          </Title>
        </Header>
        <Content style={{ margin: 24 }}>
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[200px]">
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          SalesOps © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
