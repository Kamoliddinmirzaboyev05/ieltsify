import React, { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Breadcrumb, theme, Button, Drawer } from 'antd';
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
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  reading: <BookOpen size={18} />,
  profile: <User size={18} />,
  support: <LifeBuoy size={18} />,
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  theme.useToken();

  const menuItems = SIDEBAR_MENU.map((item) => ({
    key: item.key === 'home' ? '/dashboard' : `/dashboard/${item.key}`,
    icon: iconMap[item.key] || <FileText size={18} />,
    label: item.label,
  }));

  const currentPath = location.pathname;

  const SidebarContent = (
    <>
      <div style={{ height: 64, margin: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/logo.png" alt="IELTSIFY Logo" style={{ height: '32px' }} />
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[currentPath]}
        items={menuItems.map(item => ({
          ...item,
          label: (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              {currentPath === item.key && (
                <motion.div
                  layoutId="sidebar-slider"
                  style={{
                    position: 'absolute',
                    left: -24,
                    width: '4px',
                    height: '24px',
                    background: '#10b981',
                    borderRadius: '0 4px 4px 0'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span style={{ fontWeight: currentPath === item.key ? 600 : 400 }}>{item.label}</span>
            </div>
          )
        }))}
        onClick={({ key }) => {
          navigate(key);
          setMobileVisible(false);
        }}
        style={{ borderRight: 0 }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sider */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setIsMobile(broken);
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
          display: isMobile ? 'none' : 'block'
        }}
      >
        {SidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        width={240}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ position: 'absolute', right: 16, top: 20, zIndex: 10 }}>
          <Button 
            type="text" 
            icon={<X size={20} />} 
            onClick={() => setMobileVisible(false)} 
          />
        </div>
        {SidebarContent}
      </Drawer>

      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 0 : 240), 
        transition: 'margin-left 0.2s' 
      }}>
        <Header style={{ 
          padding: isMobile ? '0 16px' : '0 24px', 
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuIcon size={20} />}
                onClick={() => setMobileVisible(true)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              />
            )}
            <div className={isMobile ? 'mobile-hide' : ''}>
              <Breadcrumb
                items={[
                  { title: currentPath === '/' ? 'Home' : (currentPath.startsWith('/dashboard') ? 'Dashboard' : (currentPath.substring(1).charAt(0).toUpperCase() + currentPath.substring(2))) },
                  { title: currentPath === '/dashboard' ? 'Overview' : (currentPath.split('/').pop()?.charAt(0).toUpperCase() || '') + (currentPath.split('/').pop()?.substring(1) || '') },
                ]}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}>
            <Badge dot color="#10b981">
              <Bell size={20} style={{ cursor: 'pointer', color: '#64748b' }} />
            </Badge>
            <Avatar 
              icon={<User size={20} />} 
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', cursor: 'pointer' }} 
            />
          </div>
        </Header>
        <Content
          style={{
            margin: isMobile ? '16px' : '24px',
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
