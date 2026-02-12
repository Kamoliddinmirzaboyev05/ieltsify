import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Spin, message, Grid } from 'antd';
import { 
  ArrowLeft,
  Volume2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ListeningTest {
  id: number;
  title: string;
  slug: string;
  description: string;
  html_file_url: string;
  cover_image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ListeningPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [test, setTest] = useState<ListeningTest | null>(location.state?.test || null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    const initTest = async () => {
      if (!test && slug) {
        await loadTest();
      } else if (test) {
        await loadHtmlContent();
      }
    };
    
    initTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadTest = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ieltsify.pythonanywhere.com';
      const accessToken = localStorage.getItem('access_token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/listening-tests/`, {
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          message.error('Iltimos, tizimga kiring');
          navigate('/login');
          return;
        }
        throw new Error('Failed to load test');
      }

      const data = await response.json();
      const foundTest = data.results.find((t: ListeningTest) => t.slug === slug);
      
      if (!foundTest) {
        throw new Error('Test not found');
      }

      setTest(foundTest);
      await loadHtmlContent(foundTest);
    } catch (error) {
      console.error('Error loading test:', error);
      message.error('Testni yuklashda xatolik yuz berdi');
      navigate('/dashboard/listening-hub');
    } finally {
      setLoading(false);
    }
  };

  const loadHtmlContent = async (testData?: ListeningTest) => {
    const currentTest = testData || test;
    if (!currentTest) return;

    setLoading(true);
    try {
      console.log('📥 Loading HTML from:', currentTest.html_file_url);
      
      // Try without authentication first for media files
      const response = await fetch(currentTest.html_file_url, {
        mode: 'cors',
        credentials: 'omit', // Don't send credentials for media files
      });
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('❌ HTML fayl topilmadi:', currentTest.html_file_url);
          message.error({
            content: 'HTML fayl serverda topilmadi. Backend administratorga xabar bering.',
            duration: 5,
          });
          return;
        }
        if (response.status === 403) {
          console.error('❌ Faylga kirish taqiqlangan:', currentTest.html_file_url);
          message.error({
            content: 'Faylga kirish taqiqlangan. CORS yoki permissions muammosi.',
            duration: 5,
          });
          return;
        }
        throw new Error(`Failed to load HTML content: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('📊 Content-Type:', contentType);

      const html = await response.text();
      console.log('✅ HTML content loaded, length:', html.length);
      console.log('📄 First 200 chars:', html.substring(0, 200));
      
      if (html.length === 0) {
        message.error('HTML fayl bo\'sh. Backendda fayl to\'g\'ri yuklanganini tekshiring.');
        return;
      }
      
      setHtmlContent(html);
    } catch (error) {
      console.error('❌ Error loading HTML content:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message.error({
          content: 'HTML faylni yuklashda tarmoq xatoligi. CORS sozlamalarini tekshiring.',
          duration: 5,
        });
      } else {
        message.error({
          content: 'Test kontentini yuklashda xatolik yuz berdi',
          duration: 5,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleBackToList = () => {
    navigate('/dashboard/listening-hub');
  };

  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      easy: '#52c41a',
      medium: '#faad14',
      hard: '#f5222d',
    };
    return colors[diff] || '#1890ff';
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: '16px'
      }}>
        <Spin size="large" />
        <Text style={{ color: '#64748b', fontSize: '15px' }}>
          Test yuklanmoqda...
        </Text>
      </div>
    );
  }

  // Error State
  if (!test) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: '16px'
      }}>
        <AlertCircle size={48} color="#f5222d" />
        <Title level={3} style={{ margin: 0 }}>Test topilmadi</Title>
        <Button type="primary" onClick={handleBackToList}>
          Listening Hub'ga qaytish
        </Button>
      </div>
    );
  }

  // Test Started - Full Screen HTML Content
  if (testStarted && htmlContent) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Minimal Header */}
        <div style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          <Button
            icon={<ArrowLeft size={18} />}
            onClick={handleBackToList}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              fontWeight: '600'
            }}
          >
            Testni tugatish
          </Button>

          <Text style={{ fontSize: isMobile ? '14px' : '16px', color: '#ffffff', fontWeight: '600' }}>
            {test.title}
          </Text>

          <div style={{ width: isMobile ? '80px' : '120px' }} />
        </div>

        {/* Full Screen HTML Content */}
        <div 
          style={{ 
            flex: 1, 
            overflow: 'auto',
            padding: '20px',
            background: '#ffffff'
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  // Test Preview - Before Starting
  return (
    <div style={{ paddingBottom: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <Button
        icon={<ArrowLeft size={18} />}
        onClick={handleBackToList}
        style={{ 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        Orqaga
      </Button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: '24px'
      }}>
        {/* Left Column - Test Info */}
        <div>
          <Card
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            {/* Cover Image */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <img
                src={test.cover_image_url}
                alt={test.title}
                style={{
                  width: '100%',
                  height: isMobile ? '200px' : '300px',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  target.parentElement!.style.display = 'flex';
                  target.parentElement!.style.alignItems = 'center';
                  target.parentElement!.style.justifyContent = 'center';
                  target.parentElement!.innerHTML = `<div style="color: white;"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg></div>`;
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: getDifficultyColor(test.difficulty),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
              </div>
            </div>

            {/* Test Details */}
            <div style={{ padding: '0 8px' }}>
              <Title level={2} style={{ marginBottom: '16px', fontSize: isMobile ? '24px' : '32px' }}>
                {test.title}
              </Title>

              <Text style={{ fontSize: '16px', color: '#64748b', display: 'block', marginBottom: '24px' }}>
                {test.description || 'IELTS Listening practice test'}
              </Text>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '16px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Clock size={24} color="#667eea" />
                  <div>
                    <Text style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
                      Davomiyligi
                    </Text>
                    <Text style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>
                      30-40 daqiqa
                    </Text>
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Volume2 size={24} color="#a855f7" />
                  <div>
                    <Text style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
                      Format
                    </Text>
                    <Text style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>
                      Audio Test
                    </Text>
                  </div>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleStartTest}
                disabled={!htmlContent}
                style={{
                  height: '56px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                {htmlContent ? 'Testni boshlash' : 'Yuklanmoqda...'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Instructions */}
        <div>
          <Card
            style={{
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <Title level={4} style={{ marginBottom: '16px' }}>
              Test Ko'rsatmalari
            </Title>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <Text style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                    Audio tinglang
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#64748b' }}>
                    Har bir qismni diqqat bilan tinglang va savollarni o'qing
                  </Text>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <Text style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                    Javoblarni yozing
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#64748b' }}>
                    Barcha savollarni to'ldiring va javoblaringizni tekshiring
                  </Text>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <Text style={{ display: 'block', fontWeight: '600', marginBottom: '4px' }}>
                    Natijalarni ko'ring
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#64748b' }}>
                    Test tugagach natijalaringizni ko'ring va tahlil qiling
                  </Text>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <Text style={{ fontSize: '14px', color: '#64748b' }}>
                💡 <strong>Maslahat:</strong> Haqiqiy IELTS testidagi kabi vaqtni boshqaring va diqqatingizni jamlang.
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;
