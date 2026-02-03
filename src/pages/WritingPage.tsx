import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Input, 
  Collapse, 
  Space, 
  Row, 
  Col, 
  Modal, 
  Spin, 
  Statistic,
  Tag
} from 'antd';
import { 
  Clock, 
  RefreshCw, 
  Send, 
  ChevronRight, 
  Lightbulb, 
} from 'lucide-react';
import { WRITING_TOPICS, type WritingTopic } from '../mockData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Countdown } = Statistic;

const WritingPage: React.FC = () => {
  const [topic, setTopic] = useState<WritingTopic>(WRITING_TOPICS[0]);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [deadline, setDeadline] = useState(Date.now() + 1000 * 60 * 40); // 40 minutes

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const handleChangeTopic = () => {
    const currentIndex = WRITING_TOPICS.findIndex(t => t.id === topic.id);
    const nextIndex = (currentIndex + 1) % WRITING_TOPICS.length;
    setTopic(WRITING_TOPICS[nextIndex]);
    setText('');
    setDeadline(Date.now() + 1000 * 60 * 40);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <Space size="large">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: 'white',
            padding: '8px 16px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <Clock size={20} color="#6B46C1" />
            <Countdown 
              value={deadline} 
              format="mm:ss" 
              valueStyle={{ fontSize: '20px', fontWeight: 'bold', color: '#6B46C1' }} 
            />
          </div>
          <Button 
            icon={<RefreshCw size={16} />} 
            onClick={handleChangeTopic}
            type="link"
            style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Change Topic
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column: The Prompt */}
        <Col xs={24} lg={10}>
          <Card 
            style={{ 
              borderRadius: '16px', 
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <Tag color="purple" style={{ marginBottom: '16px', borderRadius: '4px' }}>
              {topic.type}
            </Tag>
            <Title level={4} style={{ marginTop: 0 }}>Question</Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#1e293b' }}>
              {topic.question}
            </Paragraph>

            <Collapse 
              ghost 
              expandIcon={({ isActive }) => <ChevronRight size={16} style={{ transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />}
              style={{ marginTop: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}
            >
              <Panel header={
                <Space>
                  <Lightbulb size={18} color="#6B46C1" />
                  <Text strong>Tips & Vocabulary</Text>
                </Space>
              } key="1">
                <div style={{ padding: '0 8px 8px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Writing Tips:</Text>
                  <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                    {topic.tips.map((tip, i) => <li key={i} style={{ marginBottom: '4px', color: '#475569' }}>{tip}</li>)}
                  </ul>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Useful Vocabulary:</Text>
                  <Space wrap>
                    {topic.vocabulary.map((word, i) => (
                      <Tag key={i} style={{ borderRadius: '6px', backgroundColor: '#f1e8ff', color: '#6B46C1', border: 'none' }}>
                        {word}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Right Column: The Editor */}
        <Col xs={24} lg={14}>
          <Card 
            bodyStyle={{ padding: 0 }}
            style={{ 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing your essay here..."
              style={{
                border: 'none',
                padding: '24px',
                fontSize: '16px',
                lineHeight: '1.8',
                minHeight: '500px',
                resize: 'none',
              }}
            />
            <div style={{ 
              padding: '16px 24px', 
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff'
            }}>
              <Text type="secondary" strong>
                Word Count: <span style={{ color: '#6B46C1' }}>{wordCount}</span>
              </Text>
              <Button 
                type="primary" 
                size="large"
                icon={<Send size={18} />}
                onClick={handleSubmit}
                style={{ 
                  borderRadius: '10px', 
                  backgroundColor: '#6B46C1',
                  height: '46px',
                  padding: '0 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Submit for AI Review
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Submission Modal */}
      <Modal
        open={isSubmitting}
        footer={null}
        closable={false}
        centered
        bodyStyle={{ textAlign: 'center', padding: '40px' }}
      >
        <Spin size="large" />
        <Title level={4} style={{ marginTop: '24px' }}>Analyzing your writing...</Title>
        <Text type="secondary">Our AI is evaluating your essay based on IELTS criteria.</Text>
      </Modal>

      {/* Result Modal */}
      <Modal
        title="AI Evaluation Result"
        open={showResult}
        onOk={() => setShowResult(false)}
        onCancel={() => setShowResult(false)}
        centered
        okText="Great!"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#f3e8ff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Title level={2} style={{ margin: 0, color: '#6B46C1' }}>7.0</Title>
          </div>
          <Title level={4}>Estimated Band Score</Title>
          <Paragraph type="secondary">
            Your writing shows good task response and coherence. To reach Band 8.0, try to use more complex grammatical structures and less common vocabulary.
          </Paragraph>
          <div style={{ textAlign: 'left', marginTop: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Task Response</Text>
                <Text strong>7.5</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Coherence & Cohesion</Text>
                <Text strong>7.0</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Lexical Resource</Text>
                <Text strong>6.5</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Grammatical Range & Accuracy</Text>
                <Text strong>7.0</Text>
              </div>
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WritingPage;
