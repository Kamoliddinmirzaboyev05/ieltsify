import React, { useState, useEffect } from 'react';
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
import { loginUser, googleAuth, saveAuthTokens, saveUserProfile } from '../services/authService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form] = Form.useForm();

  // Load Google Sign-In script
  useEffect(() => {
    const handleGoogleResponse = (response: { credential: string }) => {
      handleGoogleAuth(response);
    };

    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        initializeGoogleSignIn();
      };
    };

    const initializeGoogleSignIn = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const enableGoogleAuth = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';

      if (!clientId || !enableGoogleAuth) {
        console.log('Google OAuth is disabled or client ID not configured');
        return;
      }

      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button
        const buttonDiv = document.getElementById('google-signin-button-login');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(
            buttonDiv,
            {
              theme: 'filled_black',
              size: 'large',
              width: buttonDiv.offsetWidth,
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            }
          );
        }
      }
    };

    loadGoogleScript();
  }, []);

  const handleGoogleAuth = async (response: { credential: string }) => {
    setGoogleLoading(true);
    try {
      console.log('🔐 Google Sign-In response received');
      
      const idToken = response.credential;
      
      if (!idToken) {
        throw new Error('Google ID token topilmadi');
      }

      console.log('📤 Sending Google ID token to backend...');
      
      // Send to backend
      const authResponse = await googleAuth(idToken);
      
      console.log('✅ Backend response:', authResponse);
      
      // Extract tokens (backend might return different formats)
      const accessToken = authResponse.tokens?.access || authResponse.access || authResponse.access_token;
      const refreshToken = authResponse.tokens?.refresh || authResponse.refresh || authResponse.refresh_token;
      
      if (!accessToken || !refreshToken) {
        console.error('❌ Missing tokens in response:', authResponse);
        throw new Error('Server javobida tokenlar yo\'q');
      }
      
      // Save tokens
      saveAuthTokens(accessToken, refreshToken);
      
      // Save user profile if provided
      if (authResponse.user) {
        saveUserProfile(authResponse.user);
      }
      
      console.log('✅ Google authentication successful');
      
      message.success('Google orqali muvaffaqiyatli kirdingiz!');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: unknown) {
      console.error('❌ Google Sign-In error:', error);
      
      let errorMessage = 'Google orqali kirishda xatolik';
      
      if (error instanceof Error && error.message) {
        if (error.message.includes('Invalid Google token')) {
          errorMessage = 'Google token noto\'g\'ri. Bu muammo backend sozlamalari bilan bog\'liq. Backend administratoriga murojaat qiling.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Bu Google akkaunt ro\'yxatdan o\'tmagan. Iltimos, avval ro\'yxatdan o\'ting.';
        } else if (error.message.includes('Invalid')) {
          errorMessage = 'Google autentifikatsiya xatosi. Qaytadan urinib ko\'ring.';
        } else if (error.message.includes('Server javob bermadi')) {
          errorMessage = error.message;
        } else if (error.message.includes('Serverga ulanib')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      message.error(errorMessage, 7);
    } finally {
      setGoogleLoading(false);
    }
  };

  const onFinish = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);
    try {
      console.log('🔐 Login attempt:', { username: values.email });
      
      // Username can be email or username
      const response = await loginUser({
        username: values.email, // Backend accepts both email and username
        password: values.password,
      });
      
      console.log('✅ Login response:', response);
      
      // Backend returns: {access: "...", refresh: "...", role: "..."}
      const accessToken = response.access || response.access_token;
      const refreshToken = response.refresh || response.refresh_token;
      
      if (!accessToken || !refreshToken) {
        console.error('❌ Missing tokens in response:', response);
        throw new Error('Server javobida tokenlar yo\'q');
      }
      
      // Save tokens to localStorage
      saveAuthTokens(accessToken, refreshToken);
      
      // If user info is provided, save it
      if (response.user) {
        saveUserProfile(response.user);
      }
      
      console.log('✅ Tokens saved, redirecting to dashboard...');
      
      message.success('Xush kelibsiz!');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      
      // Parse error message
      let errorMessage = 'Kirishda xatolik yuz berdi';
      
      if (error instanceof Error && error.message) {
        if (error.message.includes('credentials')) {
          errorMessage = 'Email yoki parol noto\'g\'ri';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Foydalanuvchi topilmadi';
        } else if (error.message.includes('disabled')) {
          errorMessage = 'Akkaunt bloklangan';
        } else {
          errorMessage = error.message;
        }
      }
      
      message.error(errorMessage, 5);
    } finally {
      setLoading(false);
    }
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
            <Text style={{ color: 'inherit', fontWeight: 600 }}>Orqaga</Text>
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
                Xush kelibsiz
              </Title>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                Akkauntingizga kiring
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
                rules={[
                  { required: true, message: 'Email yoki username kiriting' }
                ]}
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
                rules={[
                  { required: true, message: 'Parol kiriting' }
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
                  Parolni unutdingizmi?
                </Link>
              </div>

              <Form.Item style={{ marginBottom: '0' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                  disabled={googleLoading}
                  className="gradient-btn"
                  style={{ 
                    height: '48px', 
                    borderRadius: '12px', 
                    fontWeight: 700,
                    fontSize: '15px'
                  }}
                >
                  {loading ? 'Kirmoqda...' : 'Kirish'}
                </Button>
              </Form.Item>
            </Form>

            {import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true' && import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <>
                <Divider style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.1)', 
                  margin: '24px 0',
                  color: '#94a3b8',
                  fontSize: '13px'
                }}>
                  yoki
                </Divider>

                <div style={{ marginBottom: '16px' }}>
                  <div 
                    id="google-signin-button-login" 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      opacity: googleLoading ? 0.5 : 1,
                      pointerEvents: googleLoading ? 'none' : 'auto',
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  {googleLoading && (
                    <div style={{ 
                      textAlign: 'center', 
                      marginTop: '12px',
                      color: '#94a3b8',
                      fontSize: '13px'
                    }}>
                      Google orqali kirmoqda...
                    </div>
                  )}
                </div>
              </>
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
