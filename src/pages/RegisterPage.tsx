import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Input, 
  Form, 
  Checkbox, 
  Grid,
  Divider,
  App
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
import { registerUser, googleAuth, saveAuthTokens, saveUserProfile } from '../services/authService';
import { monetizationService } from '../services/monetizationService';
import { supabase } from '../lib/supabase';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form] = Form.useForm();
  const googleInitialized = React.useRef(false);

  // Load Google Sign-In script
  useEffect(() => {
    let mounted = true;

    const handleGoogleResponse = (response: { credential: string }) => {
      if (mounted) handleGoogleAuth(response);
    };

    const loadGoogleScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      
      if (existingScript) {
        if (window.google) {
          initializeGoogleSignIn();
        } else {
          // Script is loading, wait for it
          existingScript.addEventListener('load', () => {
            if (mounted) initializeGoogleSignIn();
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (mounted) initializeGoogleSignIn();
      };
    };

    const initializeGoogleSignIn = () => {
      if (googleInitialized.current || (window as any).google?.accounts?.id?.initialized) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const enableGoogleAuth = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';

      if (!clientId || !enableGoogleAuth) {
        console.log('Google OAuth is disabled or client ID not configured');
        return;
      }

      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          
          googleInitialized.current = true;
          (window as any).google.accounts.id.initialized = true;

          // Render the button
          const buttonDiv = document.getElementById('google-signin-button');
          if (buttonDiv) {
            window.google.accounts.id.renderButton(
              buttonDiv,
              {
                theme: 'filled_black',
                size: 'large',
                width: buttonDiv.offsetWidth,
                text: 'signup_with',
                shape: 'rectangular',
                logo_alignment: 'left',
              }
            );
          }
        } catch (error) {
          console.warn('Google Sign-In initialization failed:', error);
        }
      }
    };

    loadGoogleScript();

    return () => {
      mounted = false;
    };
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
      
      // Onboard user (bonus + referral)
      // NOTE: Basic onboarding (bonus + profile) is now handled by DB trigger
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const urlParams = new URLSearchParams(window.location.search);
          const refCode = urlParams.get('ref');
          if (refCode) {
            // Only call if there is a referral code, as the trigger handles the rest
            await monetizationService.onboardUser(user.id, refCode);
          }
        }
      } catch (onboardError) {
        console.warn('Referral onboarding skip/error:', onboardError);
      }

      // Save user profile if provided
      if (authResponse.user) {
        saveUserProfile(authResponse.user);
      }
      
      console.log('✅ Google authentication successful');
      
      message.success('Google orqali muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
      
      // Redirect to onboarding
      setTimeout(() => {
        navigate('/onboarding');
      }, 500);
    } catch (error: unknown) {
      console.error('❌ Google Sign-In error:', error);
      
      let errorMessage = 'Google orqali ro\'yxatdan o\'tishda xatolik';
      
      if (error instanceof Error && error.message) {
        if (error.message.includes('origin')) {
          errorMessage = 'Google Sign-In uchun ruxsat etilmagan origin. Backend sozlamalarini tekshiring.';
        } else if (error.message.includes('Invalid Google token')) {
          errorMessage = 'Google token noto\'g\'ri. Bu muammo backend sozlamalari bilan bog\'liq. Backend administratoriga murojaat qiling.';
        } else if (error.message.includes('already exists')) {
          errorMessage = 'Bu Google akkaunt allaqachon ro\'yxatdan o\'tgan. Iltimos, kirish sahifasiga o\'ting.';
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

  const onFinish = async (values: { username: string; name: string; email: string; password: string; agree: boolean }) => {
    setLoading(true);
    try {
      console.log('📝 Register attempt:', { 
        username: values.username,
        name: values.name, 
        email: values.email 
      });
      
      // Split name into first_name and last_name
      const nameParts = values.name.trim().split(/\s+/); // Split by any whitespace
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
      
      const registerData = {
        username: values.username.toLowerCase().trim(),
        email: values.email.toLowerCase().trim(),
        first_name: firstName,
        last_name: lastName,
        password: values.password,
      };
      
      console.log('📤 Sending registration data:', { ...registerData, password: '***' });
      
      // Call register API
      const response = await registerUser(registerData);
      
      console.log('✅ Register response:', response);
      
      // Supabase behavior: if email confirmation is enabled, session will be null
      const accessToken = response.tokens?.access || response.access || response.access_token;
      const refreshToken = response.tokens?.refresh || response.refresh || response.refresh_token;
      
      if (!accessToken || !refreshToken) {
        // Check if user was created (email confirmation might be required)
        if (response.user) {
          message.success('Ro\'yxatdan o\'tish muvaffaqiyatli! Iltimos, emailingizni tasdiqlang.', 10);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }
        console.error('❌ Missing tokens in response:', response);
        throw new Error('Server javobida tokenlar yo\'q');
      }
      
      // Save tokens to localStorage
      saveAuthTokens(accessToken, refreshToken);
      
      // Onboard user (bonus + referral)
      // NOTE: Basic onboarding (bonus + profile) is now handled by DB trigger
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const urlParams = new URLSearchParams(window.location.search);
          const refCode = urlParams.get('ref');
          if (refCode) {
            // Only call if there is a referral code, as the trigger handles the rest
            await monetizationService.onboardUser(user.id, refCode);
          }
        }
      } catch (onboardError) {
        console.warn('Referral onboarding skip/error:', onboardError);
      }
      
      // Save user profile if provided
      if (response.user) {
        saveUserProfile(response.user);
      }
      
      console.log('✅ Tokens saved successfully');
      
      message.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
      
      // Redirect to onboarding
      setTimeout(() => {
        navigate('/onboarding');
      }, 500);
    } catch (error: unknown) {
      console.error('❌ Registration error:', error);
      
      // Parse error message
      let errorMessage = 'Ro\'yxatdan o\'tishda xatolik yuz berdi';
      
      if (error instanceof Error && error.message) {
        if (error.message.includes('rate limit')) {
          errorMessage = 'Email yuborish limiti oshib ketdi. Iltimos, bir ozdan keyin urinib ko\'ring.';
        } else {
          // Try to parse JSON error message
          try {
            const errorObj = JSON.parse(error.message);
            const errorMessages: string[] = [];
            
            if (errorObj.username) {
              const msg = Array.isArray(errorObj.username) ? errorObj.username[0] : errorObj.username;
              errorMessages.push(`Username: ${msg}`);
            }
            if (errorObj.email) {
              const msg = Array.isArray(errorObj.email) ? errorObj.email[0] : errorObj.email;
              errorMessages.push(`Email: ${msg}`);
            }
            if (errorObj.password) {
              const msg = Array.isArray(errorObj.password) ? errorObj.password[0] : errorObj.password;
              errorMessages.push(`Parol: ${msg}`);
            }
            if (errorObj.first_name) {
              const msg = Array.isArray(errorObj.first_name) ? errorObj.first_name[0] : errorObj.first_name;
              errorMessages.push(`Ism: ${msg}`);
            }
            if (errorObj.last_name) {
              const msg = Array.isArray(errorObj.last_name) ? errorObj.last_name[0] : errorObj.last_name;
              errorMessages.push(`Familiya: ${msg}`);
            }
            if (errorObj.detail) {
              errorMessages.push(errorObj.detail);
            }
            if (errorObj.non_field_errors) {
              const msg = Array.isArray(errorObj.non_field_errors) ? errorObj.non_field_errors[0] : errorObj.non_field_errors;
              errorMessages.push(msg);
            }
            
            if (errorMessages.length > 0) {
              errorMessage = errorMessages.join('\n');
            }
          } catch {
            // Not a JSON error, use the message directly
            if (error.message.includes('Username:')) {
              errorMessage = error.message;
            } else if (error.message.includes('Email:')) {
              errorMessage = error.message;
            } else if (error.message.includes('Password:') || error.message.includes('Parol:')) {
              errorMessage = error.message;
            } else if (error.message.includes('already exists')) {
              errorMessage = 'Bu email yoki username allaqachon ro\'yxatdan o\'tgan';
            } else if (error.message.includes('Server javob bermadi')) {
              errorMessage = error.message;
            } else if (error.message.includes('Serverga ulanib')) {
              errorMessage = error.message;
            } else {
              errorMessage = error.message;
            }
          }
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
                Ro'yxatdan o'tish
              </Title>
              <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                IELTS tayyorgarligingizni boshlang
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
                name="username"
                rules={[
                  { required: true, message: 'Username kiriting' },
                  { min: 3, message: 'Username kamida 3 ta belgidan iborat bo\'lishi kerak' },
                  { max: 30, message: 'Username 30 ta belgidan oshmasligi kerak' },
                  { 
                    pattern: /^[a-zA-Z0-9_]+$/, 
                    message: 'Username faqat harflar, raqamlar va _ dan iborat bo\'lishi kerak' 
                  }
                ]}
                style={{ marginBottom: '16px' }}
              >
                <Input 
                  prefix={<User size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Username (masalan: john_doe)" 
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
                  { required: true, message: 'Email manzilingizni kiriting' },
                  { type: 'email', message: 'Email manzil noto\'g\'ri formatda' }
                ]}
                style={{ marginBottom: '16px' }}
              >
                <Input 
                  prefix={<Mail size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Email manzil" 
                  type="email"
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
                name="name"
                rules={[
                  { required: true, message: 'To\'liq ismingizni kiriting' },
                  { min: 2, message: 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak' },
                  { 
                    pattern: /^[a-zA-Z\s]+$/, 
                    message: 'Ism faqat lotin harflaridan iborat bo\'lishi kerak' 
                  }
                ]}
                style={{ marginBottom: '16px' }}
              >
                <Input 
                  prefix={<User size={18} style={{ color: '#64748b' }} />} 
                  placeholder="To'liq ism (masalan: John Doe)" 
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
                  { min: 8, message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' }
                ]}
                style={{ marginBottom: '16px' }}
              >
                <Input.Password 
                  prefix={<Lock size={18} style={{ color: '#64748b' }} />} 
                  placeholder="Parol (kamida 8 ta belgi)" 
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
                      value ? Promise.resolve() : Promise.reject(new Error('Shartlarni qabul qilishingiz kerak'))
                  }
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Checkbox style={{ color: '#94a3b8' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                    Men <Link to="/terms" style={{ color: '#10b981' }}>Foydalanish shartlari</Link> va <Link to="/privacy" style={{ color: '#10b981' }}>Maxfiylik siyosati</Link> bilan roziman
                  </span>
                </Checkbox>
              </Form.Item>

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
                  {loading ? 'Ro\'yxatdan o\'tmoqda...' : 'Ro\'yxatdan o\'tish'}
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
                    id="google-signin-button" 
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
                      Google orqali ro'yxatdan o'tmoqda...
                    </div>
                  )}
                </div>
              </>
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
