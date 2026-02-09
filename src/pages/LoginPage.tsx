import React from 'react';
import { 
  Typography, 
  Button, 
  Input, 
  Form, 
  Checkbox, 
  Grid
} from 'antd';
import { 
  Lock, 
  Mail, 
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DotPattern } from '../components/DotPattern';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const onFinish = (_values: any) => {
    navigate('/dashboard');
  };

  return (
    <>
      <DotPattern
        dotSize={2}
        gap={20}
        baseColor="#10b981"
        glowColor="#22d3ee"
        proximity={150}
        glowIntensity={1.2}
        waveSpeed={0.3}
      />

      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        padding: isMobile ? '20px' : '40px',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#e2e8f0', 
            textDecoration: 'none',
            marginBottom: '24px',
            width: 'fit-content'
          }}>
            <ArrowLeft size={18} style={{ marginRight: '8px' }} />
            <Text style={{ color: 'inherit', fontWeight: 600 }}>Back</Text>
          </Link>

          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '40px 32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
                <img src="/logohead.png" alt="IELTSIFY" style={{ height: '32px' }} />
              </Link>
              <Title level={2} style={{ 
                color: '#ffffff', 
                margin: '0 0 8px 0', 
                fontWeight: 800, 
                fontSize: isMobile ? '24px' : '28px', 
                letterSpacing: '-0.5px' 
              }}>
                Welcome back
              </Title>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                Sign in to continue
              </Text>
            </div>

            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Email required' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input 
                  prefix={<Mail size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Email" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    color: '#ffffff',
                    borderRadius: '12px',
                    height: '48px'
                  }} 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Password required' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input.Password 
                  prefix={<Lock size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Password" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    color: '#ffffff',
                    borderRadius: '12px',
                    height: '48px'
                  }} 
                />
              </Form.Item>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: '#94a3b8' }}>
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Remember</span>
                  </Checkbox>
                </Form.Item>
                <Link to="/forgot-password" style={{ 
                  color: '#10b981', 
                  fontWeight: 600, 
                  fontSize: '14px' 
                }}>
                  Forgot?
                </Link>
              </div>

              <Form.Item style={{ marginBottom: '16px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  className="gradient-btn"
                  style={{ 
                    height: '48px', 
                    borderRadius: '12px', 
                    fontWeight: 700,
                    fontSize: '15px'
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                No account? <Link to="/register" style={{ 
                  color: '#10b981', 
                  fontWeight: 700 
                }}>Sign up</Link>
              </Text>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
