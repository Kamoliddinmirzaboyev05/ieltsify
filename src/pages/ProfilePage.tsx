import React from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Button, 
  Tag, 
  Statistic, 
  Progress, 
  Divider, 
  Switch, 
  Space,
  Input,
  theme
} from 'antd';
import { 
  User, 
  Mail, 
  Target, 
  Calendar, 
  Settings, 
  Bell, 
  Lock, 
  CreditCard,
  LogOut,
  Camera,
  BarChart3
} from 'lucide-react';
import { USER_PROFILE, SKILL_PROGRESS } from '../mockData';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  theme.useToken();

  return (
    <div style={{ paddingBottom: '60px' }}>
      <Row gutter={[24, 24]}>
        {/* Left Column: Profile Summary */}
        <Col xs={24} lg={8}>
          <Card 
            style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'center' }}
            bodyStyle={{ padding: '40px 24px' }}
          >
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
              <Avatar size={120} icon={<User size={60} />} style={{ backgroundColor: '#f3e8ff', color: '#6B46C1', border: '4px solid #fff', boxShadow: '0 10px 25px rgba(107, 70, 193, 0.1)' }} />
              <Button 
                type="primary" 
                shape="circle" 
                icon={<Camera size={14} />} 
                size="small"
                style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: '#6B46C1', border: '2px solid #fff' }}
              />
            </div>
            <Title level={3} style={{ margin: '0 0 8px 0' }}>{USER_PROFILE.name}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>{USER_PROFILE.email}</Text>
            <Tag color="purple" style={{ borderRadius: '20px', padding: '2px 16px', fontWeight: 'bold' }}>{USER_PROFILE.membership}</Tag>
            
            <Divider style={{ margin: '32px 0' }} />
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Joined" value={USER_PROFILE.joinedDate} valueStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Status" value="Active" valueStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }} />
              </Col>
            </Row>

            <Button 
              block 
              danger 
              icon={<LogOut size={16} />} 
              style={{ marginTop: '32px', borderRadius: '12px', height: '48px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Log Out
            </Button>
          </Card>

          <Card 
            title={<Space><Target size={18} color="#6B46C1" /> My IELTS Goals</Space>}
            style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginTop: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>TARGET SCORE</Text>
                <Title level={2} style={{ margin: 0 }}>{USER_PROFILE.targetScore}</Title>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>EXAM DATE</Text>
                <Title level={4} style={{ margin: 0 }}>June 15, 2024</Title>
              </div>
            </div>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Overall Progress</Text>
            <Progress percent={75} strokeColor="#6B46C1" />
            <Text type="secondary" style={{ display: 'block', marginTop: '16px', fontSize: '12px', textAlign: 'center' }}>
              Keep practicing! You are 1.5 bands away from your goal.
            </Text>
          </Card>
        </Col>

        {/* Right Column: Performance & Settings */}
        <Col xs={24} lg={16}>
          <Card 
            title={<Space><Settings size={18} color="#6B46C1" /> Account Settings</Space>}
            style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
            bodyStyle={{ padding: '0 0 24px 0' }}
          >
            <div style={{ padding: '24px' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Full Name</Text>
                  <Input defaultValue={USER_PROFILE.name} prefix={<User size={14} color="#94a3b8" />} style={{ borderRadius: '8px', height: '40px' }} />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Email Address</Text>
                  <Input defaultValue={USER_PROFILE.email} prefix={<Mail size={14} color="#94a3b8" />} style={{ borderRadius: '8px', height: '40px' }} />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Target Band Score</Text>
                  <Input defaultValue={USER_PROFILE.targetScore} prefix={<Target size={14} color="#94a3b8" />} style={{ borderRadius: '8px', height: '40px' }} />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Target Date</Text>
                  <Input type="date" defaultValue={USER_PROFILE.targetDate} prefix={<Calendar size={14} color="#94a3b8" />} style={{ borderRadius: '8px', height: '40px' }} />
                </Col>
              </Row>
              <Button type="primary" style={{ marginTop: '24px', borderRadius: '8px', padding: '0 32px', backgroundColor: '#6B46C1', height: '40px' }}>
                Save Changes
              </Button>
            </div>

            <Divider style={{ margin: 0 }} />

            <div style={{ padding: '24px' }}>
              <Title level={5} style={{ marginBottom: '20px' }}>Security & Notifications</Title>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size={12}>
                    <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}><Bell size={16} /></div>
                    <div>
                      <Text strong style={{ display: 'block' }}>Email Notifications</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Receive daily practice reminders and tips.</Text>
                    </div>
                  </Space>
                  <Switch defaultChecked />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size={12}>
                    <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}><Lock size={16} /></div>
                    <div>
                      <Text strong style={{ display: 'block' }}>Two-Factor Authentication</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Add an extra layer of security to your account.</Text>
                    </div>
                  </Space>
                  <Switch />
                </div>
              </Space>
            </div>

            <Divider style={{ margin: 0 }} />

            <div style={{ padding: '24px' }}>
              <Title level={5} style={{ marginBottom: '20px' }}>Subscription Plan</Title>
              <Card style={{ borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space size={16}>
                    <div style={{ backgroundColor: '#6B46C1', padding: '10px', borderRadius: '12px' }}><CreditCard size={20} color="white" /></div>
                    <div>
                      <Text strong style={{ display: 'block' }}>{USER_PROFILE.membership} Plan</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Next billing date: None (Free tier)</Text>
                    </div>
                  </Space>
                  <Button type="link" style={{ color: '#6B46C1', fontWeight: 'bold' }}>Upgrade Plan</Button>
                </div>
              </Card>
            </div>
          </Card>

          <Card 
            title={<Space><BarChart3 size={18} color="#6B46C1" /> Skill Breakdown</Space>}
            style={{ borderRadius: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginTop: '24px' }}
          >
            <Row gutter={[24, 24]}>
              {SKILL_PROGRESS.map((skill, i) => (
                <Col xs={24} md={12} key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>{skill.name}</Text>
                    <Text strong style={{ color: skill.color }}>{skill.score} / {skill.maxScore}</Text>
                  </div>
                  <Progress percent={(skill.score / skill.maxScore) * 100} strokeColor={skill.color} showInfo={false} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
