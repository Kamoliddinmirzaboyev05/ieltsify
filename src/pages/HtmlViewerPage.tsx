import React, { useEffect, useState } from 'react';
import { Button, Spin, Typography, message, Grid } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { directoryOf, injectBase } from '../lib/utils';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const HtmlViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sourceUrl, setSourceUrl] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let url = params.get('url') || '';

    if (!url) {
      message.error('URL not found');
      setLoading(false);
      return;
    }

    url = url.trim();
    if (url.startsWith('`') && url.endsWith('`')) {
      url = url.slice(1, -1).trim();
    }

    let parsedHost = '';
    let parsedPath = '';
    try {
      const parsed = new URL(url, window.location.origin);
      parsedHost = parsed.hostname;
      parsedPath = parsed.pathname + parsed.search;
    } catch (e) {
      parsedHost = '';
      parsedPath = '';
      void e;
    }
    const isApiHost = parsedHost === 'api.ieltsfy.uz';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isApiHost && isLocalhost && parsedPath.startsWith('/media')) {
      url = parsedPath;
    }
    setSourceUrl(url);

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
        if (!res.ok) {
          if (res.status === 404) {
            message.error('HTML file not found');
            return;
          }
          if (res.status === 403) {
            message.error('Kirish taqiqlangan (CORS)');
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const text = await res.text();
        if (!text) {
          message.error('HTML tarkib boʼsh');
          return;
        }
        setHtml(text);
      } catch (e) {
        message.error('HTML yuklashda xatolik yuz berdi');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [location.search]);
  const buildSrcDoc = () => {
    const baseHref = directoryOf(sourceUrl);
    return injectBase(html, baseHref);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <Spin size="large" />
        <Text style={{ color: '#64748b' }}>Kontent yuklanmoqda...</Text>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0 as unknown as undefined, background: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #f0b429 0%, #d99e1e 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <Button
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#ffffff', fontWeight: 600 }}
        >
          Orqaga
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
        <div style={{ width: isMobile ? 80 : 120 }} />
      </div>

      <iframe
        title="html-viewer"
        style={{ flex: 1, border: 'none', background: '#ffffff' }}
        sandbox="allow-scripts allow-same-origin allow-forms"
        srcDoc={buildSrcDoc()}
      />
    </div>
  );
};

export default HtmlViewerPage;
