import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Breadcrumb, theme, Button, Drawer, Badge, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  PenTool,
  Mic,
  BookOpen,
  CreditCard,
  LifeBuoy,
  User,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { FiSidebar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { SIDEBAR_MENU } from '../mockData';
import { useTheme } from '../contexts/ThemeContext';
import { monetizationService } from '../services/monetizationService';
import { supabase } from '../lib/supabase';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={20} />,
  reports: <FileText size={20} />,
  writing: <PenTool size={20} />,
  speaking: <Mic size={20} />,
  pricing: <CreditCard size={20} />,
  'reading-hub': <BookOpen size={20} />,
  'listening-hub': <Mic size={20} />,
  vocabulary: <BookOpen size={20} />,
  'smart-article': <FileText size={20} />,
  profile: <User size={20} />,
  support: <LifeBuoy size={20} />,
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('ieltsify_sidebar_collapsed');
    return saved ? saved === '1' : false;
  });
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [coins, setCoins] = useState<number>(0);
  const [isPro, setIsPro] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    let channel: any;

    const loadMonetizationData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const balance = await monetizationService.getBalance(user.id);
        setCoins(balance);
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString())
          .maybeSingle();

        setIsPro(!!subscription);

        // Realtime balance update
        const userCoinsChannel = supabase
          .channel(`user-coins-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'user_coins',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              setCoins(payload.new.balance);
            }
          );
        
        channel = userCoinsChannel.subscribe();

        // Check for daily login reward
        checkDailyLogin(user.id);
      }
    };

    loadMonetizationData();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const checkDailyLogin = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastLoginKey = `last_login_reward_${userId}`;
      const lastLogin = localStorage.getItem(lastLoginKey);

      if (lastLogin !== today) {
        const reward = Math.floor(Math.random() * 11) + 10; // 10-20 coins
        const { error } = await supabase.rpc('add_coins_and_log', {
          p_user_id: userId,
          p_amount: reward,
          p_type: 'daily_login',
          p_description: 'Kunlik kirish mukofoti'
        });

        if (!error) {
          localStorage.setItem(lastLoginKey, today);
          message.success({
            content: `Xush kelibsiz! Kunlik kirish uchun ${reward} coin berildi.`,
            icon: <img src="/coin.png" alt="coin" style={{ width: 16, height: 16 }} />,
            duration: 5
          });
        }
      }
    } catch (err) {
      console.error('Daily login reward error:', err);
    }
  };

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        setCollapsed(prev => {
          const next = !prev;
          localStorage.setItem('ieltsify_sidebar_collapsed', next ? '1' : '0');
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = SIDEBAR_MENU.map((item) => ({
    key: item.key === 'home' ? '/dashboard' : `/dashboard/${item.key}`,
    icon: iconMap[item.key] || <FileText size={18} />,
    label: item.label,
  }));

  const currentPath = location.pathname;

  const SidebarContent = (
    <>
      <div style={{ height: 64, margin: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={collapsed && !isMobile ? "/logohead.png" : "/logo.png"}
          alt="IELTSIFY Logo"
          onError={(e) => {
            const t = e.currentTarget as HTMLImageElement;
            t.src = collapsed && !isMobile ? '/logohead.png' : '/logo.png';
          }}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: collapsed && !isMobile ? 32 : 40,
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
      <Menu
        theme={isDark ? 'dark' : 'light'}
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
                    background: '#2563eb',
                    borderRadius: '0 4px 4px 0'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span style={{ fontWeight: currentPath === item.key ? 700 : 500, fontSize: 15, letterSpacing: 0.2, color: currentPath === item.key ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b') }}>{item.label}</span>
            </div>
          ),
          style: {
            color: currentPath === item.key ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b'),
            fontSize: 15
          }
        }))}
        onClick={({ key }) => {
          navigate(key);
          setMobileVisible(false);
        }}
        style={{ 
          borderRight: 0,
          background: token.colorBgContainer,
          paddingInline: 12
        }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sider */}
      <Sider
        breakpoint="lg"
        collapsedWidth={72}
        collapsed={collapsed}
        collapsible
        trigger={null}
        onBreakpoint={(broken) => {
          setIsMobile(broken);
        }}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
          localStorage.setItem('ieltsify_sidebar_collapsed', collapsed ? '1' : '0');
        }}
        theme="light"
        width={260}
        style={{
          borderRight: `1px solid ${token.colorBorder}`,
          position: 'fixed',
          height: '100vh',
          left: 0,
          zIndex: 100,
          display: isMobile ? 'none' : 'block',
          background: token.colorBgContainer
        }}
      >
        {SidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={true}
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        width={260}
        styles={{ 
          body: { 
            padding: 0,
            background: token.colorBgContainer
          },
          header: {
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorder}`
          }
        }}
      >
        {SidebarContent}
      </Drawer>

      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 72 : 260), 
        transition: 'margin-left 0.2s' 
      }}>
        <Header style={{ 
          padding: isMobile ? '0 16px' : '0 24px', 
          background: token.colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${token.colorBorder}`,
          position: 'sticky',
          top: 0,
          zIndex: 99,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!isMobile && (
              <Button
                type="text"
                icon={<FiSidebar size={20} />}
                onClick={() => {
                  setCollapsed(!collapsed);
                  localStorage.setItem('ieltsify_sidebar_collapsed', !collapsed ? '1' : '0');
                }}
                style={{
                  color: token.colorTextSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            )}
            {isMobile && (
              <Button
                type="text"
                icon={<FiSidebar size={24} />}
                onClick={() => setMobileVisible(true)}
              />
            )}
            <div className={isMobile ? 'mobile-hide' : ''}>
              <Breadcrumb
                items={(() => {
                  const pathParts = currentPath.split('/').filter(Boolean);
                  if (pathParts.length === 1 && pathParts[0] === 'dashboard') {
                    return [{ title: 'Overview' }];
                  }
                  if (pathParts.length === 2 && pathParts[0] === 'dashboard') {
                    const pageName = pathParts[1]
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    return [
                      { title: 'Dashboard', href: '/dashboard' },
                      { title: pageName }
                    ];
                  }
                  return [{ title: 'Dashboard' }];
                })()}
                style={{ fontSize: '13px' }}
              />
            </div>
          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}>
            <div 
              className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-full px-3 py-1 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              onClick={() => navigate('/dashboard/pricing')}
              style={{ marginRight: '8px' }}
            >
              <img src="/coin.png" alt="coin" style={{ width: 20, height: 20, marginRight: 6 }} />
              <span className="font-bold text-yellow-600 dark:text-yellow-400 text-sm">{coins}</span>
            </div>
            {isPro && (
              <Badge count="PRO" style={{ backgroundColor: '#2563eb', fontSize: '10px' }} />
            )}
            <Button
              type="text"
              icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: token.colorText
              }}
            />
            <Bell size={20} style={{ cursor: 'pointer', color: token.colorText }} />
            <Avatar 
              icon={<User size={18} />} 
              size={36}
              style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.1)', 
                color: '#2563eb',
                cursor: 'pointer'
              }} 
              onClick={() => navigate('/dashboard/profile')}
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
