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
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DotPattern } from '../components/DotPattern';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { googleAuth, loginUser, saveAuthTokens, saveUserProfile } from '../services/authService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('🔐 Login attempt:', { username: values.email });
      
      // Username can be email or username
      const response = await loginUser({
        username: values.email, // Backend accepts both email and username
        password: values.password,
      });
      
      console.log('✅ Login response:', response);
      
      // Save tokens (response has access/refresh, not access_token/refresh_token)
      const accessToken = response.access || response.access_token;
      const refreshToken = response.refresh || response.refresh_token;
      
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid response: missing tokens');
      }
      
      saveAuthTokens(accessToken, refreshToken);
      
      // If user info is provided, save it
      if (response.user) {
        saveUserProfile(response.user);
      }
      
      console.log('✅ Tokens saved, redirecting to dashboard...');
      
      message.success('Xush kelibsiz!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      message.error(error.message || 'Kirishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      message.error('Google login failed');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Google login attempt');
      const response = await googleAuth(credentialResponse.credential);
      
      console.log('✅ Google login response:', response);
      
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
      
      message.success('Xush kelibsiz!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Google login error:', error);
      message.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    message.error('Google login failed');
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
              form={form}
              name="login"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Email yoki username kiriting' }]}
                style={{ marginBottom: '16px' }}
              >
                <Input 
                  prefix={<Mail size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Email yoki username" 
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
                rules={[{ required: true, message: 'Parol kiriting' }]}
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
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Eslab qolish</span>
                  </Checkbox>
                </Form.Item>
                <Link to="/forgot-password" style={{ 
                  color: '#10b981', 
                  fontWeight: 600, 
                  fontSize: '14px' 
                }}>
                  Unutdingizmi?
                </Link>
              </div>

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
                  Kirish
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
                text="signin_with"
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
                Kirmoqda...
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                Akkauntingiz yo'qmi? <Link to="/register" style={{ 
                  color: '#10b981', 
                  fontWeight: 700 
                }}>Ro'yxatdan o'tish</Link>
              </Text>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
