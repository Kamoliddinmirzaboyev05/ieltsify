import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import AppLayout from './components/AppLayout';
import DashboardHome from './pages/DashboardHome';
import WritingPage from './pages/WritingPage';
import SpeakingPage from './pages/SpeakingPage';
import ReportsPage from './pages/ReportsPage';
import ReadingPage from './pages/ReadingPage';
import ListeningPage from './pages/ListeningPage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VocabularyPage from './pages/VocabularyPage';
import SmartArticlePage from './pages/SmartArticlePage';
import ResourceManagerPage from './pages/ResourceManagerPage';
import ListeningHubPage from './pages/ListeningHubPage';
import ReadingPassageManager from './pages/ReadingPassageManager';
import ListeningTestManager from './pages/ListeningTestManager';
import PageTransition from './components/PageTransition';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  return (
    <AppLayout>
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
    </AppLayout>
  );
};

const AnimateRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<Navigate to="/dashboard" replace />} />
          <Route path="writing" element={<WritingPage />} />
          <Route path="speaking" element={<SpeakingPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="listening" element={<ListeningPage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="smart-article" element={<SmartArticlePage />} />
          <Route path="listening-hub" element={<ListeningHubPage />} />
          <Route path="resource-manager" element={<ResourceManagerPage />} />
          <Route path="passage-manager" element={<ReadingPassageManager />} />
          <Route path="listening-manager" element={<ListeningTestManager />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#10b981',
          borderRadius: 16,
          fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
          colorBgBase: isDark ? '#0f172a' : '#ffffff',
          colorTextBase: isDark ? '#ffffff' : '#1f2937',
          colorBgContainer: isDark ? '#1e293b' : '#ffffff',
          colorBorder: isDark ? 'rgba(16, 185, 129, 0.15)' : '#e5e7eb',
        },
        components: {
          Layout: {
            bodyBg: isDark ? '#0f172a' : '#f8fafc',
            headerBg: isDark ? '#0f172a' : '#ffffff',
            siderBg: isDark ? '#0f172a' : '#ffffff',
          },
          Card: {
            borderRadiusLG: 20,
            colorBgContainer: isDark ? '#1e293b' : '#ffffff',
            colorBorderSecondary: isDark ? 'rgba(16, 185, 129, 0.15)' : '#e5e7eb',
          },
          Menu: {
            darkItemBg: '#0f172a',
            darkItemSelectedBg: 'rgba(16, 185, 129, 0.1)',
            darkItemHoverBg: 'rgba(16, 185, 129, 0.05)',
            darkItemColor: '#94a3b8',
            darkItemSelectedColor: '#10b981',
            darkItemHoverColor: '#10b981',
            itemBg: isDark ? '#0f172a' : '#ffffff',
            itemSelectedBg: 'rgba(16, 185, 129, 0.1)',
            itemHoverBg: 'rgba(16, 185, 129, 0.05)',
            itemColor: isDark ? '#94a3b8' : '#64748b',
            itemSelectedColor: '#10b981',
            itemHoverColor: '#10b981',
          },
          Breadcrumb: {
            itemColor: isDark ? '#94a3b8' : '#64748b',
            linkColor: isDark ? '#94a3b8' : '#64748b',
            linkHoverColor: '#10b981',
            separatorColor: isDark ? '#475569' : '#cbd5e1',
          },
          Input: {
            colorBgContainer: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            colorBorder: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1d5db',
            colorText: isDark ? '#e2e8f0' : '#1f2937',
          },
          Select: {
            colorBgContainer: isDark ? '#1e293b' : '#ffffff',
            colorBorder: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1d5db',
          },
          Modal: {
            contentBg: isDark ? '#1e293b' : '#ffffff',
            headerBg: isDark ? '#1e293b' : '#ffffff',
          },
        },
      }}
    >
      <BrowserRouter>
        <AnimateRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
