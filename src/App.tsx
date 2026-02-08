import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AnimatePresence } from 'framer-motion';
import AppLayout from './components/AppLayout';
import DashboardHome from './pages/DashboardHome';
import WritingPage from './pages/WritingPage';
import SpeakingPage from './pages/SpeakingPage';
import ReportsPage from './pages/ReportsPage';
import ReadingPage from './pages/ReadingPage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TestBuilder from './pages/TestBuilder';
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
          <Route path="test-builder" element={<TestBuilder />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10b981',
          borderRadius: 16,
          fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
          colorBgBase: '#ffffff',
          colorTextBase: '#1e293b',
        },
        components: {
          Layout: {
            bodyBg: '#f8fafc',
            headerBg: '#ffffff',
          },
          Card: {
            borderRadiusLG: 20,
          }
        },
      }}
    >
      <BrowserRouter>
        <AnimateRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
