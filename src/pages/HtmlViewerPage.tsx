import React, { useEffect, useRef, useState } from 'react';
import { Button, Spin, Typography, message, Grid } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { directoryOf, resolveRelativeUrl } from '../lib/utils';

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let url = params.get('url') || '';

    if (!url) {
      message.error('URL topilmadi');
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
    const isPythonAnywhereHost = parsedHost === 'ieltsify.pythonanywhere.com';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isPythonAnywhereHost && isLocalhost && parsedPath.startsWith('/media')) {
      url = parsedPath;
    }
    setSourceUrl(url);

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
        if (!res.ok) {
          if (res.status === 404) {
            message.error('HTML fayl topilmadi');
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
  useEffect(() => {
    if (!containerRef.current || !html || !sourceUrl) return;
    const head = document.head;
    const baseEl = document.createElement('base');
    baseEl.id = 'html-viewer-base';
    baseEl.href = directoryOf(sourceUrl);
    const prevBase = document.getElementById('html-viewer-base');
    if (prevBase) {
      prevBase.remove();
    }
    head.appendChild(baseEl);
    const styles: HTMLLinkElement[] = [];
    const scripts: HTMLScriptElement[] = [];
    const container = containerRef.current;
    const linkNodes = container.querySelectorAll('link[rel="stylesheet"]');
    linkNodes.forEach((ln) => {
      const href = ln.getAttribute('href') || '';
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = resolveRelativeUrl(directoryOf(sourceUrl), href);
      head.appendChild(linkEl);
      styles.push(linkEl);
    });
    const scriptNodes = container.querySelectorAll('script');
    scriptNodes.forEach((sn) => {
      const src = sn.getAttribute('src');
      const type = sn.getAttribute('type') || '';
      const newScript = document.createElement('script');
      if (type) newScript.type = type;
      if (sn.hasAttribute('async')) newScript.async = true;
      if (sn.hasAttribute('defer')) newScript.defer = true;
      const crossorigin = sn.getAttribute('crossorigin');
      if (crossorigin) newScript.crossOrigin = crossorigin;
      if (src && src.length > 0) {
        newScript.src = resolveRelativeUrl(directoryOf(sourceUrl), src);
      } else {
        newScript.text = sn.textContent || '';
      }
      container.appendChild(newScript);
      scripts.push(newScript);
      sn.remove();
    });
    return () => {
      styles.forEach((l) => l.remove());
      scripts.forEach((s) => s.remove());
      const b = document.getElementById('html-viewer-base');
      if (b) b.remove();
    };
  }, [html, sourceUrl]);

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
      <div style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <Button
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#ffffff', fontWeight: 600 }}
        >
          Orqaga
        </Button>
        <Text style={{ fontSize: isMobile ? 14 : 16, color: '#ffffff', fontWeight: 600 }}>
          HTML Viewer
        </Text>
        <div style={{ width: isMobile ? 80 : 120 }} />
      </div>

      <div ref={containerRef} style={{ flex: 1, overflow: 'auto', padding: 20, background: '#ffffff' }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default HtmlViewerPage;
