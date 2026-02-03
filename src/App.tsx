import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppLayout from './components/AppLayout';
import DashboardHome from './pages/DashboardHome';
import WritingPage from './pages/WritingPage';
import SpeakingPage from './pages/SpeakingPage';
import ReportsPage from './pages/ReportsPage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6B46C1',
          borderRadius: 8,
          fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        },
        components: {
          Layout: {
            bodyBg: '#f5f7fa',
          },
        },
      }}
    >
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/speaking" element={<SpeakingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            {/* Additional routes will be added here */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
};




export default App;
