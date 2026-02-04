import React from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  Input, 
  Form, 
  Checkbox, 
  Divider,
  Row,
  Col
} from 'antd';
import { 
  Lock, 
  Mail, 
  ArrowLeft,
  Github,
  Chrome
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '480px', zIndex: 10 }}
      >
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: '#64748b', 
          textDecoration: 'none',
          marginBottom: '32px',
          width: 'fit-content'
        }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          <Text style={{ color: 'inherit', fontWeight: 600 }}>Back to homepage</Text>
        </Link>

        <Card 
          className="glass-card"
          bordered={false}
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
          bodyStyle={{ padding: '48px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '24px' }}>
              <img src="/logo.png" alt="IELTSIFY Logo" style={{ height: '40px' }} />
            </Link>
            <Title level={2} style={{ color: '#0f172a', margin: 0, fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' }}>
              Welcome back
            </Title>
            <Text style={{ color: '#64748b', fontSize: '16px' }}>
              Enter your credentials to continue
            </Text>
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="email"
              label={<Text style={{ color: '#475569', fontWeight: 600 }}>Email Address</Text>}
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input 
                prefix={<Mail size={18} style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                placeholder="name@example.com" 
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  color: '#1e293b',
                  borderRadius: '12px',
                  height: '54px'
                }} 
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text style={{ color: '#475569', fontWeight: 600 }}>Password</Text>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                prefix={<Lock size={18} style={{ color: '#94a3b8', marginRight: '8px' }} />} 
                placeholder="••••••••" 
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  color: '#1e293b',
                  borderRadius: '12px',
                  height: '54px'
                }} 
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#64748b' }}>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#10b981', fontWeight: 600 }}>Forgot password?</Link>
            </div>

            <Form.Item style={{ marginBottom: '32px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                className="gradient-btn"
                style={{ 
                  height: '56px', 
                  borderRadius: '12px', 
                  fontWeight: 800,
                  fontSize: '16px'
                }}
              >
                Sign In
              </Button>
            </Form.Item>

            <Divider style={{ borderColor: '#e2e8f0', color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>OR CONTINUE WITH</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Button 
                  block 
                  style={{ 
                    height: '54px', 
                    borderRadius: '12px', 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}
                >
                  <Chrome size={20} style={{ marginRight: '10px' }} /> Google
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  block 
                  style={{ 
                    height: '54px', 
                    borderRadius: '12px', 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600
                  }}
                >
                  <Github size={20} style={{ marginRight: '10px' }} /> GitHub
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Text style={{ color: '#64748b', fontSize: '15px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#10b981', fontWeight: 700 }}>Sign up for free</Link>
          </Text>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
