import React, { useState, useEffect } from 'react';
import { Card, Typography, Select, Empty, Spin, Button, Space, Tag, Grid, message } from 'antd';
import { Headphones, Play, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

import { useListeningTests } from '../hooks/useCachedData';
import CoinGuard from '../components/CoinGuard';
import type { ListeningTest } from '../types';

const ListeningHubPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const { data: tests = [], isLoading: loading } = useListeningTests();
  const [difficulty, setDifficulty] = useState<string>('all');

  const handleStartTest = (test: ListeningTest) => {
    navigate(`/dashboard/listening/${test.slug}`, { state: { test } });
  };

  const filteredTests = difficulty === 'all'
    ? tests
    : (tests as ListeningTest[]).filter(t => t.difficulty === difficulty);

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

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          marginBottom: '32px',
          gap: isMobile ? '16px' : '0'
        }}
      >
        <div>
          <Title level={1} style={{ margin: 0, fontSize: isMobile ? '28px' : '36px', fontWeight: '800' }}>
            <Headphones size={isMobile ? 32 : 40} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#2563eb' }} />
            Listening Tests
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
            IELTS Listening practice testlari bilan mashq qiling
          </Text>
        </div>
        <Select
          value={difficulty}
          onChange={setDifficulty}
          style={{ width: isMobile ? '100%' : '200px' }}
          size="large"
        >
          <Select.Option value="all">Barcha darajalar</Select.Option>
          <Select.Option value="easy">Oson</Select.Option>
          <Select.Option value="medium">O'rta</Select.Option>
          <Select.Option value="hard">Qiyin</Select.Option>
        </Select>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <Card style={{ borderRadius: '12px', background: '#2563eb', border: 'none' }}>
          <div style={{ color: 'white' }}>
            <BookOpen size={24} style={{ marginBottom: '8px' }} />
            <Title level={3} style={{ color: 'white', margin: '8px 0' }}>{tests.length}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Jami testlar</Text>
          </div>
        </Card>
        <Card style={{ borderRadius: '12px', background: '#4b5563', border: 'none' }}>
          <div style={{ color: 'white' }}>
            <Clock size={24} style={{ marginBottom: '8px' }} />
            <Title level={3} style={{ color: 'white', margin: '8px 0' }}>30-40 min</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Test davomiyligi</Text>
          </div>
        </Card>
        <Card style={{ borderRadius: '12px', background: '#334155', border: 'none' }}>
          <div style={{ color: 'white' }}>
            <TrendingUp size={24} style={{ marginBottom: '8px' }} />
            <Title level={3} style={{ color: 'white', margin: '8px 0' }}>Band 9.0</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Maksimal ball</Text>
          </div>
        </Card>
      </motion.div>

      {/* Tests Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">Listening testlar yuklanmoqda...</Text>
          </div>
        </div>
      ) : filteredTests.length === 0 ? (
        <Empty
          description={
            <span>
              {difficulty === 'all' 
                ? 'Hozircha listening testlar mavjud emas' 
                : `${difficulty} darajasida testlar topilmadi`}
            </span>
          }
          style={{ marginTop: '60px' }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                hoverable
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
                cover={
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    {test.cover_image_url ? (
                      <img
                        alt={test.title}
                        src={test.cover_image_url}
                        style={{
                          width: '100%',
                          height: '220px',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          // Fallback gradient if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.style.background = '#2563eb';
                          target.parentElement!.style.display = 'flex';
                          target.parentElement!.style.alignItems = 'center';
                          target.parentElement!.style.justifyContent = 'center';
                          target.parentElement!.innerHTML = `<div style="color: white;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg></div>`;
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '220px',
                        background: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                      </div>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: getDifficultyColor(test.difficulty),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {getDifficultyIcon(test.difficulty)}
                      {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                    </div>
                  </div>
                }
              >
                <div style={{ padding: '8px 0' }}>
                  <Title level={4} style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }} ellipsis={{ rows: 2 }}>
                    {test.title}
                  </Title>
                  
                  <Paragraph
                    type="secondary"
                    style={{ marginBottom: '16px', fontSize: '14px', minHeight: '40px' }}
                    ellipsis={{ rows: 2 }}
                  >
                    {test.description || 'IELTS Listening practice test'}
                  </Paragraph>

                  <Space style={{ marginBottom: '16px', flexWrap: 'wrap' }}>
                    <Tag icon={<Clock size={14} />} color="blue">
                      30-40 min
                    </Tag>
                    <Tag icon={<Headphones size={14} />} color="purple">
                      Audio Test
                    </Tag>
                    {!test.is_active && (
                      <Tag color="red">
                        Nofaol
                      </Tag>
                    )}
                  </Space>

                  <CoinGuard
                      cost={20}
                      type="listening_test"
                      description={`Listening Test: ${test.title}`}
                      onConfirm={() => handleStartTest(test)}
                      isSubscriptionBenefit={true}
                    >
                      <Button
                        type="primary"
                        size="large"
                        block
                        icon={<Play size={18} />}
                        style={{
                          borderRadius: '8px',
                          height: '44px',
                          fontWeight: '600',
                          fontSize: '14px',
                          background: '#2563eb',
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                        }}
                      >
                        Testni boshlash
                      </Button>
                    </CoinGuard>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ListeningHubPage;
