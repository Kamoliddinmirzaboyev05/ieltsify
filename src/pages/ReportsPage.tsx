import React from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Space,
  Grid,
  Spin
} from 'antd';
import { 
  PenTool, 
  Mic, 
  BarChart2, 
  TrendingUp, 
  Eye 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useWritingSubmissions } from '../hooks/useCachedData';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ReportsPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { data: rawSubmissions = [], isLoading } = useWritingSubmissions();

  const submissions = React.useMemo(() => {
    return rawSubmissions.map((s, index) => ({
      key: s.id,
      date: new Date(s.submittedAt).toLocaleDateString(),
      type: 'Writing',
      topic: `Task ${index + 1}`,
      score: s.aiFeedback?.overallScore || 0,
      attempt: index + 1
    }));
  }, [rawSubmissions]);

  const avgScore = submissions.length > 0 
    ? (submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length).toFixed(1) 
    : '0.0';

  const summaryCards = [
    { title: 'Avg Writing', value: avgScore, icon: <PenTool size={isMobile ? 20 : 24} color="#6B46C1" />, bgColor: '#f3e8ff' },
    { title: 'Avg Speaking', value: '0.0', icon: <Mic size={isMobile ? 20 : 24} color="#6B46C1" />, bgColor: '#f3e8ff' },
    { title: 'Tests Taken', value: submissions.length.toString(), icon: <BarChart2 size={isMobile ? 20 : 24} color="#6B46C1" />, bgColor: '#f3e8ff' },
    { title: 'Est. Band', value: avgScore, icon: <TrendingUp size={isMobile ? 20 : 24} color="#6B46C1" />, bgColor: '#f3e8ff' },
  ];

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Spin size="large" /></div>;
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Space>
          {type === 'Writing' ? <PenTool size={14} /> : <Mic size={14} />}
          {type}
        </Space>
      ),
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      ellipsis: true,
      minWidth: 150,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => {
        let color = 'green';
        if (score < 6) color = 'red';
        else if (score < 7) color = 'orange';
        return <Tag color={color} style={{ borderRadius: '6px', fontWeight: 'bold' }}>{score.toFixed(1)}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: () => (
        <Button size="small" icon={<Eye size={14} />} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          View Detail
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '32px' }}>
      <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>My Reports</Title>

      {/* 1. Summary Cards */}
      <Row gutter={[isMobile ? 12 : 24, isMobile ? 12 : 24]}>
        {summaryCards.map((card, index) => (
          <Col xs={12} sm={12} md={6} key={index}>
            <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: isMobile ? '16px' : '24px' }}>
              <Space direction="vertical" size={isMobile ? 8 : 12}>
                <div style={{ 
                  width: isMobile ? '40px' : '48px', 
                  height: isMobile ? '40px' : '48px', 
                  backgroundColor: card.bgColor, 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>{card.title}</Text>
                  <Title level={3} style={{ margin: 0, fontSize: isMobile ? '20px' : '24px' }}>{card.value}</Title>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* 2. Recent Activity Table */}
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Activity" 
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Table 
              columns={columns} 
              dataSource={submissions} 
              pagination={false}
              scroll={{ x: 600 }}
              style={{ borderRadius: '8px', overflow: 'hidden' }}
            />
          </Card>
        </Col>

        {/* 3. Progress Chart */}
        <Col xs={24} lg={8}>
          <Card 
            title="Performance Trend" 
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: isMobile ? 'auto' : '100%' }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px', fontSize: isMobile ? '12px' : '14px' }}>
              Writing Score Improvement
            </Text>
            <div style={{ width: '100%', height: isMobile ? '200px' : '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissions} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="attempt" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  />
                  <YAxis 
                    domain={[0, 9]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6B46C1" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#6B46C1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage;
