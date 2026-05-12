import React, { useState } from 'react';
import { Card, Typography, Select, Empty, Spin, Button, Space, Tag, Grid } from 'antd';
import { BookOpen, Play, Clock, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

import { useReadingPassages } from '../hooks/useCachedData';
import CoinGuard from '../components/CoinGuard';
import type { ReadingPassage } from '../types';

const ReadingHubPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const { data: passages = [], isLoading: loading } = useReadingPassages();
  const [difficulty, setDifficulty] = useState<string>('all');

  const handleStartTest = (passage: ReadingPassage) => {
    navigate(`/dashboard/reading/${passage.slug}`, { state: { passage } });
  };

  const filteredPassages = difficulty === 'all'
    ? passages
    : (passages as ReadingPassage[]).filter(p => p.difficulty === difficulty);

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
    const minutes = Math.ceil(wordCount / 225);
    return `${minutes} min`;
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
            <BookOpen size={isMobile ? 32 : 40} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#2563eb' }} />
            Reading Passages
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
            IELTS Reading practice passagelari bilan mashq qiling
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
            <FileText size={24} style={{ marginBottom: '8px' }} />
            <Title level={3} style={{ color: 'white', margin: '8px 0' }}>{passages.length}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Jami passagelar</Text>
          </div>
        </Card>
        <Card style={{ borderRadius: '12px', background: '#4b5563', border: 'none' }}>
          <div style={{ color: 'white' }}>
            <Clock size={24} style={{ marginBottom: '8px' }} />
            <Title level={3} style={{ color: 'white', margin: '8px 0' }}>60 min</Title>
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

      {/* Passages Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">Reading passagelar yuklanmoqda...</Text>
          </div>
        </div>
      ) : filteredPassages.length === 0 ? (
        <Empty
          description={
            <span>
              {difficulty === 'all' 
                ? 'Hozircha reading passagelar mavjud emas' 
                : `${difficulty} darajasida passagelar topilmadi`}
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
          {filteredPassages.map((passage, index) => (
            <motion.div
              key={passage.id}
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
                    <img
                      alt={passage.title}
                      src={passage.cover_image_url}
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.style.background = '#2563eb';
                        target.parentElement!.style.display = 'flex';
                        target.parentElement!.style.alignItems = 'center';
                        target.parentElement!.style.justifyContent = 'center';
                        target.parentElement!.innerHTML = `<div style="color: white;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>`;
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: getDifficultyColor(passage.difficulty),
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
                      {getDifficultyIcon(passage.difficulty)}
                      {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)}
                    </div>
                  </div>
                }
              >
                <div style={{ padding: '8px 0' }}>
                  <Title level={4} style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }} ellipsis={{ rows: 2 }}>
                    {passage.title}
                  </Title>
                  
                  <Paragraph
                    type="secondary"
                    style={{ marginBottom: '16px', fontSize: '14px', minHeight: '40px' }}
                  >
                    {passage.word_count.toLocaleString()} words • {getReadingTime(passage.word_count)} reading time
                  </Paragraph>

                  <Space style={{ marginBottom: '16px', flexWrap: 'wrap' }}>
                    <Tag icon={<Clock size={14} />} color="blue">
                      {getReadingTime(passage.word_count)}
                    </Tag>
                    <Tag icon={<FileText size={14} />} color="purple">
                      {passage.word_count.toLocaleString()} words
                    </Tag>
                    {!passage.is_active && (
                      <Tag color="red">
                        Nofaol
                      </Tag>
                    )}
                  </Space>

                  <CoinGuard
                    cost={20}
                    type="reading_test"
                    description={`Reading Test: ${passage.title}`}
                    onConfirm={() => handleStartTest(passage)}
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

export default ReadingHubPage;
