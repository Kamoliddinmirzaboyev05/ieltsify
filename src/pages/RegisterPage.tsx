import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Input, 
  Form, 
  Checkbox, 
  Grid,
  message,
  Divider
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
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { googleAuth, registerUser, saveAuthTokens, saveUserProfile } from '../services/authService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('📝 Register attempt:', { name: values.name, email: values.email });
      
      // Split name into first_name and last_name
      const nameParts = values.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || firstName;
      
      // Create username from email (before @)
      const username = values.email.split('@')[0];
      
      const response = await registerUser({
        username,
        email: values.email,
        first_name: firstName,
        last_name: lastName,
        password: values.password,
      });
      
      console.log('✅ Register response:', response);
      
      // Save tokens
      const accessToken = response.access_token || response.access;
      const refreshToken = response.refresh_token || response.refresh;
      
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid response: missing tokens');
      }
      
      saveAuthTokens(accessToken, refreshToken);
      
      // Save user profile if provided
      if (response.user) {
        saveUserProfile(response.user);
      }
      
      console.log('✅ Tokens saved, redirecting to dashboard...');
      
      message.success('Ro\'yxatdan o\'tdingiz!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      message.error(error.message || 'Ro\'yxatdan o\'tishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      message.error('Google registration failed');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Google registration attempt');
      const response = await googleAuth(credentialResponse.credential);
      
      console.log('✅ Google registration response:', response);
      
      // Google OAuth returns: {message: "...", user: {...}, tokens: {access: "...", refresh: "..."}}
      let accessToken: string | undefined;
      let refreshToken: string | undefined;
      
      // Check if tokens are nested in tokens object
      if (response.tokens) {
        accessToken = response.tokens.access;
        refreshToken = response.tokens.refresh;
      } else {
        // Fallback to direct properties
        accessToken = response.access_token || response.access;
        refreshToken = response.refresh_token || response.refresh;
      }
      
      console.log('Token extraction:', { 
        has_tokens_object: !!response.tokens,
        accessToken: accessToken ? 'present' : 'missing',
        refreshToken: refreshToken ? 'present' : 'missing'
      });
      
      if (!accessToken || !refreshToken) {
        console.error('❌ Missing tokens in response:', response);
        throw new Error('Invalid response: missing tokens');
      }
      
      saveAuthTokens(accessToken, refreshToken);
      
      // Save user profile if provided
      if (response.user) {
        saveUserProfile(response.user);
      }
      
      message.success('Ro\'yxatdan o\'tdingiz!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Google registration error:', error);
      message.error(error.message || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    message.error('Google registration failed');
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
              form={form}
              name="register"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: 'Ism kiriting' },
                  { min: 2, message: 'Kamida 2 ta harf' }
                ]}
                style={{ marginBottom: '16px' }}
              >
                <Input 
                  prefix={<User size={18} style={{ color: '#64748b' }} />} 
                  placeholder="To'liq ism" 
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
                  { required: true, message: 'Email kiriting' },
                  { type: 'email', message: 'Email noto\'g\'ri' }
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
                  { required: true, message: 'Parol kiriting' },
                  { min: 8, message: 'Kamida 8 ta belgi' }
                ]}
                style={{ marginBottom: '16px' }}
              >
                <Input.Password 
                  prefix={<Lock size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Parol" 
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
                      value ? Promise.resolve() : Promise.reject(new Error('Shartlarni qabul qiling'))
                  }
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Checkbox style={{ color: '#94a3b8' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                    Men <Link to="/terms" style={{ color: '#10b981' }}>Shartlar</Link> va <Link to="/privacy" style={{ color: '#10b981' }}>Maxfiylik</Link> bilan roziman
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item style={{ marginBottom: '16px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                  className="gradient-btn"
                  style={{ 
                    height: '48px', 
                    borderRadius: '12px', 
                    fontWeight: 700,
                    fontSize: '15px'
                  }}
                >
                  Ro'yxatdan o'tish
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ 
              borderColor: 'rgba(255, 255, 255, 0.1)', 
              margin: '24px 0',
              color: '#94a3b8',
              fontSize: '14px'
            }}>
              Yoki Google bilan
            </Divider>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                size="large"
                text="signup_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>

            {loading && (
              <div style={{ 
                textAlign: 'center', 
                color: '#10b981',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                Ro'yxatdan o'tmoqda...
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                Akkauntingiz bormi? <Link to="/login" style={{ 
                  color: '#10b981', 
                  fontWeight: 700 
                }}>Kirish</Link>
              </Text>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
