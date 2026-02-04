import React from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Divider, 
  List,
  Tag,
  Grid
} from 'antd';
import { 
  Check
} from 'lucide-react';
import { PRICING_PLANS } from '../mockData';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const PricingPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Title level={isMobile ? 2 : 1} style={{ marginBottom: '16px' }}>Choose Your Plan</Title>
        <Paragraph type="secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Select the best plan for your IELTS preparation journey. Unlock advanced AI features and unlimited practice.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center" align="stretch">
        {PRICING_PLANS.map(plan => (
          <Col xs={24} md={8} key={plan.id}>
            <Card 
              hoverable
              style={{ 
                borderRadius: '24px', 
                border: plan.recommended ? '2px solid #6B46C1' : '1px solid #f1f5f9',
                boxShadow: plan.recommended ? '0 20px 40px rgba(107, 70, 193, 0.1)' : '0 4px 20px rgba(0,0,0,0.02)',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              bodyStyle={{ padding: '40px', display: 'flex', flexDirection: 'column', flex: 1 }}
            >
              {plan.recommended && (
                <Tag 
                  color="#6B46C1" 
                  style={{ 
                    position: 'absolute', 
                    top: '-12px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    borderRadius: '20px',
                    padding: '2px 16px',
                    fontWeight: 'bold',
                    border: 'none'
                  }}
                >
                  MOST POPULAR
                </Tag>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Text strong style={{ fontSize: '14px', letterSpacing: '1px', color: '#64748b', textTransform: 'uppercase' }}>{plan.name}</Text>
                <div style={{ margin: '16px 0' }}>
                  <Text style={{ fontSize: '48px', fontWeight: 'bold' }}>${plan.price}</Text>
                  <Text type="secondary" style={{ fontSize: '16px' }}> / {plan.period}</Text>
                </div>
              </div>

              <Divider style={{ margin: '0 0 32px 0' }} />

              <List
                dataSource={plan.features}
                renderItem={feature => (
                  <List.Item style={{ border: 'none', padding: '8px 0', borderBottom: 'none' }}>
                    <Space size={12}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        backgroundColor: plan.recommended ? '#6B46C1' : '#f1f5f9', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <Check size={12} color={plan.recommended ? 'white' : '#64748b'} strokeWidth={3} />
                      </div>
                      <Text style={{ color: '#475569' }}>{feature}</Text>
                    </Space>
                  </List.Item>
                )}
                style={{ marginBottom: '40px', flex: 1 }}
              />

              <Button 
                type={plan.recommended ? "primary" : "default"} 
                size="large" 
                block 
                style={{ 
                  borderRadius: '12px', 
                  height: '54px', 
                  fontWeight: 'bold',
                  backgroundColor: plan.recommended ? '#6B46C1' : 'transparent',
                  borderColor: plan.recommended ? '#6B46C1' : '#6B46C1',
                  color: plan.recommended ? 'white' : '#6B46C1'
                }}
              >
                Get Started
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        <Title level={3} style={{ marginBottom: '48px' }}>Frequently Asked Questions</Title>
        <Row gutter={[48, 32]} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: '12px' }}>Can I cancel my subscription?</Title>
            <Paragraph type="secondary">Yes, you can cancel your Pro or Premium subscription at any time from your profile settings. No hidden fees.</Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: '12px' }}>Is the AI feedback accurate?</Title>
            <Paragraph type="secondary">Our AI is trained specifically on IELTS band descriptors (Cambridge standards) to provide the most realistic scores and feedback.</Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: '12px' }}>Do you offer school discounts?</Title>
            <Paragraph type="secondary">Yes! We have special plans for educational institutions and language schools. Contact our support team for a quote.</Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5} style={{ marginBottom: '12px' }}>How often are new tests added?</Title>
            <Paragraph type="secondary">We add at least 5 new full practice tests for Reading and Writing every month to keep the material fresh.</Paragraph>
          </Col>
        </Row>
      </div>

      <div style={{ 
        marginTop: '80px', 
        padding: '60px', 
        borderRadius: '32px', 
        background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: '24px' }}>Ready to hit your Target Score?</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '32px' }}>
          Join over 10,000 students who achieved their dreams with IELTSIFY.
        </Paragraph>
        <Button 
          size="large" 
          style={{ 
            borderRadius: '12px', 
            height: '56px', 
            padding: '0 48px', 
            border: 'none', 
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Start 7-Day Free Trial
        </Button>
      </div>
    </div>
  );
};

export default PricingPage;
