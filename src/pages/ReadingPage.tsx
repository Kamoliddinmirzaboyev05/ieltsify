import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Radio, 
  Input, 
  Space, 
  Divider, 
  Progress,
  Result,
  Grid
} from 'antd';
import { 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  CheckCircle
} from 'lucide-react';
import { READING_PASSAGES, type ReadingPassage } from '../mockData';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

type ReadingState = 'listing' | 'practice' | 'result';

const ReadingPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [pageState, setPageState] = useState<ReadingState>('listing');
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);

  const startPractice = (passage: ReadingPassage) => {
    setCurrentPassage(passage);
    setAnswers({});
    setPageState('practice');
    window.scrollTo(0, 0);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    if (!currentPassage) return;
    let correct = 0;
    currentPassage.questions.forEach(q => {
      if (answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
        correct++;
      }
    });
    setScore(correct);
    setPageState('result');
  };

  const renderListing = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>IELTS Reading Practice</Title>
        <Text type="secondary">Improve your reading skills with academic passages and actual exam-type questions.</Text>
      </header>

      <Row gutter={[24, 24]}>
        {READING_PASSAGES.map(passage => (
          <Col xs={24} md={12} key={passage.id}>
            <Card 
              style={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: '#ecfdf5', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BookOpen size={24} color="#10b981" />
                </div>
                <Tag color={passage.difficulty === 'Hard' ? 'red' : passage.difficulty === 'Medium' ? 'orange' : 'green'}>
                  {passage.difficulty}
                </Tag>
              </div>
              <Title level={4} style={{ marginBottom: '12px' }}>{passage.title}</Title>
              <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: '24px' }}>
                {passage.content}
              </Paragraph>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space size={16}>
                  <Space size={4}><Clock size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>20 mins</Text></Space>
                  <Space size={4}><CheckCircle size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{passage.questions.length} Questions</Text></Space>
                </Space>
                <Button 
                  type="primary" 
                  onClick={() => startPractice(passage)}
                  style={{ borderRadius: '8px', backgroundColor: '#10b981', border: 'none' }}
                >
                  Start Practice
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderPractice = () => {
    if (!currentPassage) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            icon={<ArrowLeft size={18} />} 
            type="text" 
            onClick={() => setPageState('listing')}
            style={{ fontWeight: '600' }}
          >
            Back to Tests
          </Button>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '8px 16px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={18} color="#10b981" />
            <Text strong style={{ fontSize: '16px' }}>19:45</Text>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={<Title level={4} style={{ margin: 0 }}>Reading Passage</Title>}
              style={{ borderRadius: '20px', border: 'none', height: isMobile ? 'auto' : 'calc(100vh - 200px)', overflowY: isMobile ? 'visible' : 'auto' }}
              bodyStyle={{ padding: isMobile ? '20px' : '32px' }}
            >
              <Title level={3} style={{ marginBottom: '24px', textAlign: 'center' }}>{currentPassage.title}</Title>
              <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#1e293b' }}>
                {currentPassage.content.split('\n').map((para, i) => (
                  <Paragraph key={i} style={{ marginBottom: '20px' }}>{para}</Paragraph>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={<Title level={4} style={{ margin: 0 }}>Questions</Title>}
              style={{ borderRadius: '20px', border: 'none', height: isMobile ? 'auto' : 'calc(100vh - 200px)', overflowY: isMobile ? 'visible' : 'auto' }}
              bodyStyle={{ padding: '24px' }}
            >
              {currentPassage.questions.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ 
                      minWidth: '28px', 
                      height: '28px', 
                      backgroundColor: '#f1f5f9', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#64748b'
                    }}>
                      {idx + 1}
                    </div>
                    <Text strong style={{ fontSize: '15px' }}>{q.question}</Text>
                  </div>

                  {q.type === 'multiple-choice' && (
                    <Radio.Group 
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                      value={answers[q.id]}
                      style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '40px' }}
                    >
                      {q.options?.map(opt => (
                        <Radio key={opt} value={opt}>{opt}</Radio>
                      ))}
                    </Radio.Group>
                  )}

                  {q.type === 'tfng' && (
                    <Radio.Group 
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                      value={answers[q.id]}
                      style={{ display: 'flex', gap: '16px', paddingLeft: '40px' }}
                    >
                      <Radio value="True">True</Radio>
                      <Radio value="False">False</Radio>
                      <Radio value="Not Given">Not Given</Radio>
                    </Radio.Group>
                  )}

                  {q.type === 'gap-fill' && (
                    <div style={{ paddingLeft: '40px' }}>
                      <Input 
                        placeholder="Type your answer..." 
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                        value={answers[q.id]}
                        style={{ maxWidth: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  {idx < currentPassage.questions.length - 1 && <Divider style={{ margin: '24px 0 0 0' }} />}
                </div>
              ))}
              <Button 
                type="primary" 
                size="large" 
                block 
                onClick={calculateScore}
                style={{ borderRadius: '12px', height: '54px', fontWeight: 'bold', backgroundColor: '#10b981', border: 'none', marginTop: '16px' }}
              >
                Submit Answers
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderResult = () => {
    if (!currentPassage) return null;
    const percentage = (score / currentPassage.questions.length) * 100;

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card style={{ borderRadius: '32px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <Result
            status={percentage > 50 ? "success" : "info"}
            title={<Title level={2}>Practice Complete!</Title>}
            subTitle={`You scored ${score} out of ${currentPassage.questions.length} questions.`}
            extra={[
              <Button 
                type="primary" 
                key="home" 
                onClick={() => setPageState('listing')}
                style={{ borderRadius: '8px', height: '44px', padding: '0 32px' }}
              >
                Done
              </Button>,
              <Button 
                key="retry" 
                onClick={() => startPractice(currentPassage)}
                style={{ borderRadius: '8px', height: '44px' }}
              >
                Try Again
              </Button>
            ]}
          >
            <div style={{ marginTop: '32px' }}>
              <Title level={4} style={{ marginBottom: '24px', textAlign: 'center' }}>Score Analysis</Title>
              <div style={{ width: '200px', margin: '0 auto 48px' }}>
                <Progress 
                  type="circle" 
                  percent={Math.round(percentage)} 
                  strokeColor={{ '0%': '#10b981', '100%': '#34d399' }} 
                  strokeWidth={10}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentPassage.questions.map((q, idx) => {
                  const isCorrect = answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim();
                  return (
                    <div key={q.id} style={{ 
                      padding: '20px', 
                      borderRadius: '16px', 
                      backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2',
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      gap: isMobile ? '12px' : '0'
                    }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ color: '#475569' }}>Q{idx + 1}: {q.question}</Text>
                        {!isCorrect && (
                          <div style={{ marginTop: '4px' }}>
                            <Text type="secondary" style={{ fontSize: '13px' }}>Your answer: </Text>
                            <Text delete type="danger" style={{ fontSize: '13px' }}>{answers[q.id] || '(No answer)'}</Text>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Tag color={isCorrect ? 'green' : 'red'} style={{ borderRadius: '4px', fontWeight: 'bold' }}>
                          {isCorrect ? 'CORRECT' : 'INCORRECT'}
                        </Tag>
                        {!isCorrect && <div style={{ marginTop: '4px' }}><Text strong style={{ color: '#10b981' }}>{q.answer}</Text></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Result>
        </Card>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {pageState === 'listing' && renderListing()}
      {pageState === 'practice' && renderPractice()}
      {pageState === 'result' && renderResult()}
    </div>
  );
};

export default ReadingPage;
