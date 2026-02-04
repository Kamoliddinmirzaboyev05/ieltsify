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
  User,
  ArrowLeft,
  Github,
  Chrome
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
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
      padding: '40px 20px',
      position: 'relative'
    }}>
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '540px', zIndex: 10 }}
      >
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'rgba(255,255,255,0.6)', 
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
            <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800, fontSize: '32px', letterSpacing: '-1px' }}>
              Create an account
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
              Join 50,000+ students mastering IELTS today
            </Text>
          </div>

          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="fullname"
              label={<Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Full Name</Text>}
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input 
                prefix={<User size={18} style={{ color: 'rgba(255,255,255,0.3)', marginRight: '8px' }} />} 
                placeholder="John Doe" 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'white',
                  borderRadius: '12px',
                  height: '54px'
                }} 
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Email Address</Text>}
              rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input 
                prefix={<Mail size={18} style={{ color: 'rgba(255,255,255,0.3)', marginRight: '8px' }} />} 
                placeholder="name@example.com" 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'white',
                  borderRadius: '12px',
                  height: '54px'
                }} 
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Password</Text>}
              rules={[{ required: true, message: 'Please enter your password' }, { min: 8, message: 'Password must be at least 8 characters' }]}
            >
              <Input.Password 
                prefix={<Lock size={18} style={{ color: 'rgba(255,255,255,0.3)', marginRight: '8px' }} />} 
                placeholder="••••••••" 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'white',
                  borderRadius: '12px',
                  height: '54px'
                }} 
              />
            </Form.Item>

            <Form.Item name="agreement" valuePropName="checked" rules={[{ validator: (_: any, value: boolean) => value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')) }]} style={{ marginBottom: '32px' }}>
              <Checkbox style={{ color: 'rgba(255,255,255,0.5)' }}>
                I agree to the <Link to="/terms" style={{ color: '#8b5cf6', fontWeight: 600 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: '#8b5cf6', fontWeight: 600 }}>Privacy Policy</Link>
              </Checkbox>
            </Form.Item>

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
                Create Account
              </Button>
            </Form.Item>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontWeight: 600 }}>OR SIGN UP WITH</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Button 
                  block 
                  style={{ 
                    height: '54px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'white',
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
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'white',
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
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>
            Already have an account? <Link to="/login" style={{ color: '#8b5cf6', fontWeight: 700 }}>Sign in</Link>
          </Text>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
