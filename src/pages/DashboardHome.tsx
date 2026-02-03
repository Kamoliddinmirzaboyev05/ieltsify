import React from 'react';
import { Card, Typography, Space, Row, Col, Progress, Tag, Button } from 'antd';
import { 
  CheckCircle2, 
  Trophy, 
  AlertTriangle, 
  Medal, 
  ChevronLeft, 
  ChevronRight,
  Target,
  PenTool,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DASHBOARD_STATS, SKILL_PROGRESS } from '../mockData';

const { Title, Text, Paragraph } = Typography;

const DashboardHome: React.FC = () => {
  // Activity data for Feb 2026 heatmap mockup
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={1} style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>Dashboard</Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>Welcome back! Here's your IELTS progress overview.</Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text type="secondary" style={{ fontSize: '12px', fontWeight: '600' }}>Goal</Text>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#ef4444', lineHeight: 1 }}>8</div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Text strong type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Total Tests</Text>
              <div style={{ padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
                <CheckCircle2 size={20} color="#22c55e" />
              </div>
            </div>
            <Title level={2} style={{ margin: 0, fontSize: '28px' }}>{DASHBOARD_STATS.totalTests}</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>0 completed</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Text strong type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Best Score</Text>
              <div style={{ padding: '8px', backgroundColor: '#fff1f2', borderRadius: '12px' }}>
                <Trophy size={20} color="#ef4444" />
              </div>
            </div>
            <Title level={2} style={{ margin: 0, fontSize: '28px' }}>{DASHBOARD_STATS.bestScore.toFixed(1)}</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>Band {DASHBOARD_STATS.bestScore.toFixed(1)}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Text strong type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Weak Area</Text>
              <div style={{ padding: '8px', backgroundColor: '#fff7ed', borderRadius: '12px' }}>
                <AlertTriangle size={20} color="#f97316" />
              </div>
            </div>
            <Title level={2} style={{ margin: 0, fontSize: '28px' }}>{DASHBOARD_STATS.weakArea}</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>Score: {DASHBOARD_STATS.weakScore.toFixed(1)}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Text strong type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Strong Skill</Text>
              <div style={{ padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
                <Medal size={20} color="#22c55e" />
              </div>
            </div>
            <Title level={2} style={{ margin: 0, fontSize: '28px' }}>{DASHBOARD_STATS.strongSkill}</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>Score: {DASHBOARD_STATS.strongScore.toFixed(1)}</Text>
          </Card>
        </Col>
      </Row>

      {/* Hero Section */}
      <Card
        style={{
          background: 'linear-gradient(90deg, #3b82f6 0%, #2dd4bf 100%)',
          borderRadius: '24px',
          border: 'none',
          color: 'white',
          position: 'relative',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ 
          position: 'absolute', 
          left: '-16px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          backgroundColor: 'white',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}>
          <ChevronLeft size={20} color="#64748b" />
        </div>
        <div style={{ 
          position: 'absolute', 
          right: '-16px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          backgroundColor: 'white',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}>
          <ChevronRight size={20} color="#64748b" />
        </div>

        <Row align="middle">
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                <PenTool size={24} color="white" />
              </div>
              <div>
                <Title level={3} style={{ color: 'white', margin: 0, fontSize: '24px' }}>AI Writing Evaluation</Title>
              </div>
              <Tag style={{ 
                marginLeft: 'auto', 
                backgroundColor: '#22c55e', 
                color: 'white', 
                border: 'none',
                borderRadius: '20px',
                padding: '4px 12px',
                fontWeight: '600'
              }}>
                95%+ ACCURACY
              </Tag>
            </div>
            
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '24px', maxWidth: '80%' }}>
              Get your essays scored by IELTS criteria with 95%+ accuracy. Upload custom tests or evaluate previously written essays!
            </Paragraph>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
              {['TA', 'CC', 'LR', 'GRA'].map(metric => (
                <Col key={metric}>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    minWidth: '60px'
                  }}>
                    <Text strong style={{ color: 'white', fontSize: '12px' }}>{metric}</Text>
                  </div>
                </Col>
              ))}
            </Row>

            <Row gutter={24} style={{ marginBottom: '32px' }}>
              {['Task Achievement', 'Coherence', 'Lexical Resource', 'Grammar'].map(criterion => (
                <Col key={criterion} xs={24} sm={12} lg={6}>
                  <div style={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    padding: '12px 16px', 
                    borderRadius: '12px' 
                  }}>
                    <Text strong style={{ color: 'white', display: 'block', fontSize: '12px', marginBottom: '4px' }}>{criterion}</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} color="white" />
                      <Text style={{ color: 'white', fontSize: '12px' }}>Analyzed</Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <Button 
              size="large" 
              style={{ 
                borderRadius: '12px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '0 24px',
                height: '48px'
              }}
            >
              Try Writing <ArrowRight size={18} />
            </Button>
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ 
              width: i === 1 ? '24px' : '8px', 
              height: '8px', 
              borderRadius: '4px', 
              backgroundColor: i === 1 ? '#ef4444' : 'rgba(255,255,255,0.4)',
              transition: 'width 0.3s'
            }} />
          ))}
        </div>
      </Card>

      {/* Main Grid: Activity and Progress */}
      <Row gutter={[24, 24]}>
        {/* Left: Activity */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>My Activity</Title>
                <Text type="secondary">February 2026</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Less</Text>
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: level === 0 ? '#f1f5f9' : `rgba(239, 68, 68, ${level * 0.25})`
                  }} />
                ))}
                <Text type="secondary" style={{ fontSize: '12px' }}>More</Text>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '12px',
              textAlign: 'center'
            }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <Text key={day} type="secondary" strong style={{ fontSize: '12px', marginBottom: '8px' }}>{day}</Text>
              ))}
              
              {/* Padding for start of month */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`pad-${i}`} style={{ padding: '20px', color: '#e2e8f0', fontSize: '14px' }}>
                  {26 + i}
                </div>
              ))}

              {days.map(day => (
                <div 
                  key={day} 
                  style={{ 
                    padding: '20px', 
                    backgroundColor: day === 3 ? 'transparent' : '#f8fafc',
                    border: day === 3 ? '1px solid #3b82f6' : 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: day === 3 ? '600' : '400',
                    color: day === 3 ? '#3b82f6' : '#64748b'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right: Target Score */}
        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>Target Score</Title>
                <Title level={1} style={{ margin: 0, color: '#ef4444' }}>8</Title>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Days Left</Text>
                <div style={{ fontSize: '20px', fontWeight: '800' }}>254 <Clock size={16} /></div>
              </div>
            </div>

            <Space direction="vertical" style={{ width: '100%' }} size={24}>
              {SKILL_PROGRESS.map(skill => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong style={{ fontSize: '14px' }}>{skill.name}</Text>
                    <Text strong style={{ color: skill.color }}>{skill.score.toFixed(1)} <Text type="secondary" style={{ fontSize: '12px', fontWeight: '400' }}>/ 9.0</Text></Text>
                  </div>
                  <Progress 
                    percent={(skill.score / skill.maxScore) * 100} 
                    strokeColor={skill.color} 
                    showInfo={false} 
                    strokeWidth={8}
                    trailColor="#f1f5f9"
                  />
                </div>
              ))}

              <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <Text strong>Overall Progress</Text>
                  <Text strong>0.0 / 8</Text>
                </div>
                <Progress percent={0} strokeColor="#ef4444" showInfo={false} strokeWidth={4} />
                <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '12px' }}>
                  Achieve your target IELTS score
                </Paragraph>
              </div>

              <div style={{ 
                backgroundColor: '#fff1f2', 
                borderRadius: '16px', 
                padding: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '8px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={18} color="#ef4444" />
                    <Text strong style={{ fontSize: '14px' }}>Gap to Target</Text>
                  </div>
                  <Text strong style={{ fontSize: '20px', color: '#ef4444' }}>8.0</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Focus on your weakest skills to improve faster
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;
