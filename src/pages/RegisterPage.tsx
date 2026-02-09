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
  User,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DotPattern } from '../components/DotPattern';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const RegisterPage: React.FC = () => {
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
                Create account
              </Title>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                Start your IELTS journey
              </Text>
            </div>

            <Form
              name="register"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Name required' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input 
                  prefix={<User size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Full name" 
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
                name="email"
                rules={[
                  { required: true, message: 'Email required' },
                  { type: 'email', message: 'Invalid email' }
                ]}
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
                rules={[
                  { required: true, message: 'Password required' },
                  { min: 6, message: 'Min 6 characters' }
                ]}
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

              <Form.Item
                name="agree"
                valuePropName="checked"
                rules={[
                  { 
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Please accept terms'))
                  }
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Checkbox style={{ color: '#94a3b8' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                    I agree to the <Link to="/terms" style={{ color: '#10b981' }}>Terms</Link> and <Link to="/privacy" style={{ color: '#10b981' }}>Privacy</Link>
                  </span>
                </Checkbox>
              </Form.Item>

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
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                Have an account? <Link to="/login" style={{ 
                  color: '#10b981', 
                  fontWeight: 700 
                }}>Sign in</Link>
              </Text>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
