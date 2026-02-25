import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Spin, message, Grid } from 'antd';
import { 
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ReadingPage.css';
import { directoryOf, injectBase } from '../lib/utils';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface ReadingPassage {
  id: number;
  title: string;
  slug: string;
  html_content_url: string;
  html_content?: string;
  cover_image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  word_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ReadingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [passage, setPassage] = useState<ReadingPassage | null>(location.state?.passage || null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    const initPassage = async () => {
      if (!passage && slug) {
        await loadPassage();
      } else if (passage) {
        await loadHtmlContent();
      }
    };
    
    initPassage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadPassage = async () => {
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
      
      const response = await fetch(`${API_BASE_URL}/reading-passages/`, {
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          message.error('Iltimos, tizimga kiring');
          navigate('/login');
          return;
        }
        throw new Error('Failed to load passage');
      }

      const data = await response.json();
      const foundPassage = data.results.find((p: ReadingPassage) => p.slug === slug);
      
      if (!foundPassage) {
        throw new Error('Passage not found');
      }

      // Fetch detail to get html_content string if not present
      let detailed: ReadingPassage = foundPassage;
      try {
        const detailRes = await fetch(`${API_BASE_URL}/reading-passages/${foundPassage.id}/`, { headers });
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          detailed = { ...foundPassage, ...detailData };
        }
      } catch {
        void 0;
      }

      setPassage(detailed);
      await loadHtmlContent(detailed);
    } catch (error) {
      console.error('Error loading passage:', error);
      message.error('Passageni yuklashda xatolik yuz berdi');
      navigate('/dashboard/reading-hub');
    } finally {
      setLoading(false);
    }
  };

  const loadHtmlContent = async (passageData?: ReadingPassage) => {
    const currentPassage = passageData || passage;
    if (!currentPassage) return;

    setLoading(true);
    try {
      // If backend provides full HTML string, use it directly
      if (currentPassage.html_content && currentPassage.html_content.trim().length > 0) {
        setHtmlContent(currentPassage.html_content);
        return;
      }

      let urlToFetch = (currentPassage.html_content_url || '').trim();

      if (urlToFetch.startsWith('`') && urlToFetch.endsWith('`')) {
        urlToFetch = urlToFetch.slice(1, -1).trim();
      }

      let parsedHost = '';
      let parsedPath = '';
      try {
        const parsed = new URL(urlToFetch, window.location.origin);
        parsedHost = parsed.hostname;
        parsedPath = parsed.pathname + parsed.search;
      } catch (e) {
        parsedHost = '';
        parsedPath = '';
        void e;
      }
      const isPythonAnywhereHost = parsedHost === 'ieltsify.pythonanywhere.com';
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isPythonAnywhereHost && isLocalhost && parsedPath.startsWith('/media')) {
        urlToFetch = parsedPath;
      }

      console.log('📥 Loading HTML from:', urlToFetch);
      
      const response = await fetch(urlToFetch, {
        mode: 'cors',
        credentials: 'omit',
      });
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('❌ HTML fayl topilmadi:', currentPassage.html_content_url);
          message.error({
            content: 'HTML fayl serverda topilmadi. Backend administratorga xabar bering.',
            duration: 5,
          });
          return;
        }
        if (response.status === 403) {
          console.error('❌ Faylga kirish taqiqlangan:', currentPassage.html_content_url);
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
        message.error('HTML fayl bo\'sh. Backend\'da fayl to\'g\'ri yuklanganini tekshiring.');
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
          content: 'Passage kontentini yuklashda xatolik yuz berdi',
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

  const buildSrcDoc = () => {
    // Compute base
    let baseHref = '';
    try {
      const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
      const baseTag = doc.querySelector('base[href]');
      if (baseTag) baseHref = baseTag.getAttribute('href') || '';
    } catch {
      baseHref = '';
    }
    if (!baseHref && passage?.html_content_url) {
      baseHref = directoryOf(passage.html_content_url.trim().replace(/^`|`$/g, ''));
    }
    if (!baseHref) {
      baseHref = (import.meta.env.VITE_ASSETS_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || window.location.origin;
    }
    return injectBase(htmlContent, baseHref);
  };

  const handleBackToList = () => {
    navigate('/dashboard/reading-hub');
  };

  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      easy: '#52c41a',
      medium: '#faad14',
      hard: '#f5222d',
    };
    return colors[diff] || '#1890ff';
  };

  const getDifficultyIcon = (diff: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      easy: <TrendingUp size={16} style={{ transform: 'rotate(-45deg)' }} />,
      medium: <TrendingUp size={16} />,
      hard: <TrendingUp size={16} style={{ transform: 'rotate(45deg)' }} />,
    };
    return icons[diff] || <TrendingUp size={16} />;
  };

  const getReadingTime = (wordCount: number) => {
    // Average reading speed: 200-250 words per minute
    const minutes = Math.ceil(wordCount / 225);
    return `${minutes} min`;
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
          Passage yuklanmoqda...
        </Text>
      </div>
    );
  }

  // Error State
  if (!passage) {
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
        <Title level={3} style={{ margin: 0 }}>Passage topilmadi</Title>
        <Button type="primary" onClick={handleBackToList}>
          Reading Hub'ga qaytish
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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

          <img
            src="/logohead.png"
            alt="IELTSify"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.src = '/logo.png';
            }}
            style={{
              height: isMobile ? 24 : 28,
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.15))'
            }}
          />

          <div style={{ width: isMobile ? '80px' : '120px' }} />
        </div>

        {/* Full Screen HTML Content (isolated) */}
        <iframe
          title="reading-content"
          style={{ flex: 1, border: 'none', background: '#ffffff' }}
          sandbox="allow-scripts allow-same-origin allow-forms"
          srcDoc={buildSrcDoc()}
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
        {/* Left Column - Passage Info */}
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
                src={passage.cover_image_url}
                alt={passage.title}
                style={{
                  width: '100%',
                  height: isMobile ? '200px' : '300px',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                  target.parentElement!.style.display = 'flex';
                  target.parentElement!.style.alignItems = 'center';
                  target.parentElement!.style.justifyContent = 'center';
                  target.parentElement!.innerHTML = `<div style="color: white;"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>`;
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: getDifficultyColor(passage.difficulty),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {getDifficultyIcon(passage.difficulty)}
                {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)}
              </div>
            </div>

            {/* Passage Details */}
            <div style={{ padding: '0 8px' }}>
              <Title level={2} style={{ marginBottom: '16px', fontSize: isMobile ? '24px' : '32px' }}>
                {passage.title}
              </Title>

              <Paragraph style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px' }}>
                IELTS Reading passage with {passage.word_count.toLocaleString()} words
              </Paragraph>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Clock size={24} color="#3b82f6" />
                  <div>
                    <Text style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
                      O'qish vaqti
                    </Text>
                    <Text style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>
                      {getReadingTime(passage.word_count)}
                    </Text>
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <FileText size={24} color="#10b981" />
                  <div>
                    <Text style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
                      So'zlar soni
                    </Text>
                    <Text style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>
                      {passage.word_count.toLocaleString()}
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
                  <BookOpen size={24} color="#a855f7" />
                  <div>
                    <Text style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>
                      Format
                    </Text>
                    <Text style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>
                      IELTS
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
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                    Passageni o'qing
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#64748b' }}>
                    Matnni diqqat bilan o'qing va asosiy fikrlarni tushunishga harakat qiling
                  </Text>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                    Savollarni javoblang
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#64748b' }}>
                    Barcha savollarga javob bering va javoblaringizni tekshiring
                  </Text>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <Text style={{ fontSize: '14px', color: '#64748b' }}>
                💡 <strong>Maslahat:</strong> IELTS Reading testida 60 daqiqa vaqt beriladi. Vaqtni to'g'ri boshqaring!
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;
