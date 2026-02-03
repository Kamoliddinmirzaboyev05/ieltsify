import React, { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Breadcrumb, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  PenTool,
  Mic,
  RefreshCw,
  BarChart2,
  BookOpen,
  CreditCard,
  LifeBuoy,
  User,
  Bell,
} from 'lucide-react';
import { SIDEBAR_MENU } from '../mockData';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={18} />,
  reports: <FileText size={18} />,
  writing: <PenTool size={18} />,
  speaking: <Mic size={18} />,
  rewriter: <RefreshCw size={18} />,
  'sample-reports': <BarChart2 size={18} />,
  lessons: <BookOpen size={18} />,
  pricing: <CreditCard size={18} />,
  support: <LifeBuoy size={18} />,
};
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  theme.useToken();

  const menuItems = SIDEBAR_MENU.map((item) => ({
    key: item.key === 'home' ? '/' : `/${item.key}`,
    icon: iconMap[item.key] || <FileText size={18} />,
    label: item.label,
  }));

  const currentPath = location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
        }}
        theme="light"
        width={240}
        style={{
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          height: '100vh',
          left: 0,
          zIndex: 100,
        }}
      >
        <div style={{ height: 64, margin: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#6B46C1', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>IELTSIFY</h1>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentPath]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 0 : 240, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          width: '100%',
        }}>
          <div>
            <Breadcrumb
               items={[
                { title: 'Dashboard' },
                { title: currentPath === '/' ? 'Home' : currentPath.substring(1).charAt(0).toUpperCase() + currentPath.substring(2) },
              ]}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Badge dot color="#6B46C1">
              <Bell size={20} style={{ cursor: 'pointer', color: '#64748b' }} />
            </Badge>
            <Avatar 
              icon={<User size={20} />} 
              style={{ backgroundColor: '#f3e8ff', color: '#6B46C1', cursor: 'pointer' }} 
            />
          </div>
        </Header>
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
            background: 'transparent',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
