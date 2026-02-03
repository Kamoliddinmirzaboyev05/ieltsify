import React from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Space 
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
import { RECENT_REPORTS, WRITING_PROGRESS } from '../mockData';

const { Title, Text } = Typography;

const ReportsPage: React.FC = () => {
  const summaryCards = [
    { title: 'Avg Writing', value: '7.2', icon: <PenTool size={24} color="#6B46C1" />, bgColor: '#f3e8ff' },
    { title: 'Avg Speaking', value: '6.8', icon: <Mic size={24} color="#6B46C1" />, bgColor: '#f3e8ff' },
    { title: 'Tests Taken', value: '12', icon: <BarChart2 size={24} color="#6B46C1" />, bgColor: '#f3e8ff' },
    { title: 'Est. Band', value: '7.0', icon: <TrendingUp size={24} color="#6B46C1" />, bgColor: '#f3e8ff' },
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
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
      render: () => (
        <Button size="small" icon={<Eye size={14} />} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          View Detail
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Title level={2}>My Reports</Title>

      {/* 1. Summary Cards */}
      <Row gutter={[24, 24]}>
        {summaryCards.map((card, index) => (
          <Col xs={12} sm={12} md={6} key={index}>
            <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <Space direction="vertical" size={12}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: card.bgColor, 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: '14px' }}>{card.title}</Text>
                  <Title level={3} style={{ margin: 0 }}>{card.value}</Title>
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
              dataSource={RECENT_REPORTS} 
              pagination={false}
              style={{ borderRadius: '8px', overflow: 'hidden' }}
            />
          </Card>
        </Col>

        {/* 3. Progress Chart */}
        <Col xs={24} lg={8}>
          <Card 
            title="Performance Trend" 
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', height: '100%' }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
              Writing Score Improvement
            </Text>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WRITING_PROGRESS} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="attempt" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <YAxis 
                    domain={[0, 9]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6B46C1" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: '#6B46C1', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
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
