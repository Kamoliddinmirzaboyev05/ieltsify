import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Row, Col, Space, Grid } from 'antd';
import { 
  Headphones, 
  ArrowRight,
  ArrowLeft,
  FileCode
} from 'lucide-react';
import { listeningTestManager } from '../services/dataManager';
import type { ListeningTest } from '../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ListeningPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ListeningTest | null>(null);
  const [testStarted, setTestStarted] = useState(false);

  // Load tests from localStorage
  useEffect(() => {
    setTests(listeningTestManager.getAll());
  }, []);

  const handleStartTest = (test: ListeningTest) => {
    setSelectedTest(test);
    setTestStarted(true);
  };

  const handleBackToList = () => {
    setTestStarted(false);
    setSelectedTest(null);
  };

  // Test List View
  if (!testStarted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
        {/* Header */}
        <div>
          <Title level={1} style={{ margin: 0, fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#ffffff' }}>
            Listening Practice
          </Title>
          <Text style={{ fontSize: isMobile ? '14px' : '15px', color: '#64748b' }}>
            Choose a test to start your IELTS listening practice
          </Text>
        </div>

        {/* Tests Grid */}
        {tests.length === 0 ? (
          <Card
            style={{
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              padding: '60px 20px'
            }}
          >
            <div style={{ 
              padding: '24px', 
              backgroundColor: 'rgba(168, 85, 247, 0.1)', 
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              <Headphones size={48} color="#a855f7" />
            </div>
            <Title level={3} style={{ color: '#ffffff', marginBottom: '12px' }}>
              No Listening Tests Available
            </Title>
            <Text style={{ color: '#64748b', fontSize: '15px' }}>
              Upload listening tests in the Listening Test Manager to get started
            </Text>
          </Card>
        ) : (
          <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]}>
            {tests.map((test) => (
              <Col xs={24} sm={12} lg={8} key={test.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  styles={{ body: { padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' } }}
                  onClick={() => handleStartTest(test)}
                >
                  <div style={{ flex: 1 }}>
                    {test.imageUrl && (
                      <div style={{ marginBottom: '16px' }}>
                        <img
                          src={test.imageUrl}
                          alt={test.title}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />
                      </div>
                    )}

                    {!test.imageUrl && (
                      <div style={{ 
                        padding: '12px', 
                        backgroundColor: 'rgba(168, 85, 247, 0.1)', 
                        borderRadius: '12px',
                        display: 'inline-block',
                        marginBottom: '16px'
                      }}>
                        <FileCode size={24} color="#a855f7" />
                      </div>
                    )}

                    <Title level={4} style={{ color: '#ffffff', marginBottom: '12px', fontSize: '18px' }}>
                      {test.title}
                    </Title>

                    <Space orientation="vertical" size={12} style={{ width: '100%', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileCode size={14} color="#64748b" />
                        <Text style={{ fontSize: '13px', color: '#64748b' }}>
                          IELTS Listening Test
                        </Text>
                      </div>
                    </Space>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<ArrowRight size={18} />}
                    style={{
                      backgroundColor: '#10b981',
                      borderColor: '#10b981',
                      height: '48px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Start Listening
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  }

  // Test View - Full Screen Iframe
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Minimal Header */}
      <div style={{
        padding: '16px 24px',
        background: '#0f172a',
        borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          icon={<ArrowLeft size={18} />}
          onClick={handleBackToList}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff'
          }}
        >
          Exit Test
        </Button>

        <Text style={{ fontSize: '16px', color: '#ffffff', fontWeight: '600' }}>
          {selectedTest?.title}
        </Text>
      </div>

      {/* Full Screen Iframe */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <iframe
          srcDoc={selectedTest?.htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          title={selectedTest?.title}
        />
      </div>
    </div>
  );
};

export default ListeningPage;
