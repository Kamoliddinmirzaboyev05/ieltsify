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
  Tag,
  Progress,
  message,
  Empty,
  Grid
} from 'antd';
import { 
  Clock, 
  RefreshCw, 
  Send, 
  ChevronRight,
  FileEdit,
  ArrowLeft,
  Plus,
  FileText
} from 'lucide-react';
import { WRITING_TOPICS, WRITING_COLLECTIONS, type WritingTopic, type WritingCollection } from '../mockData';
import { evaluateWriting, type WritingEvaluation } from '../services/aiService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Countdown } = Statistic;
const { useBreakpoint } = Grid;

type PageState = 'listing' | 'editor' | 'result';

const WritingPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [pageState, setPageState] = useState<PageState>('listing');
  const [topic, setTopic] = useState<WritingTopic>(WRITING_TOPICS[0]);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [deadline, setDeadline] = useState(Date.now() + 1000 * 60 * 40);
  const [activeFilter, setActiveFilter] = useState('All Tests');

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const handleStartPractice = (_collection: WritingCollection) => {
    setTopic(WRITING_TOPICS.find(t => t.id === 'w1') || WRITING_TOPICS[0]);
    setText('');
    setEvaluation(null);
    setPageState('editor');
    setDeadline(Date.now() + 1000 * 60 * 60); // 60 mins for writing
  };

  const handleChangeTopic = () => {
    const currentIndex = WRITING_TOPICS.findIndex(t => t.id === topic.id);
    const nextIndex = (currentIndex + 1) % WRITING_TOPICS.length;
    setTopic(WRITING_TOPICS[nextIndex]);
    setText('');
    setEvaluation(null);
    setPageState('editor');
    setDeadline(Date.now() + 1000 * 60 * 40);
  };

  const handleSubmit = async () => {
    if (wordCount < 10) {
      message.warning("Please write at least 10 words before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await evaluateWriting(topic.question, text);
      setEvaluation(result);
      setPageState('result');
      message.success("Analysis complete!");
    } catch (error) {
      message.error("Failed to analyze writing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderListing = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '32px' : '48px' }}>
      {/* Recommended Section */}
      <div>
        <Title level={4} style={{ marginBottom: '24px' }}>Recommended Tasks</Title>
        <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]}>
          {WRITING_COLLECTIONS.filter(c => c.recommended).map(collection => (
            <Col xs={24} md={12} lg={8} key={collection.id}>
              <Card 
                style={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', height: '100%' }}
                bodyStyle={{ padding: isMobile ? '20px' : '24px', display: 'flex', flexDirection: 'column' }}
              >
                <Tag color="blue" style={{ width: 'fit-content', borderRadius: '20px', padding: '2px 12px', border: 'none', backgroundColor: '#eff6ff', color: '#3b82f6', marginBottom: '16px', fontWeight: 'bold' }}>
                  Recommended
                </Tag>
                <Title level={4} style={{ fontSize: isMobile ? '16px' : '18px', marginBottom: '12px', minHeight: isMobile ? 'auto' : '54px' }}>{collection.title}</Title>
                <Paragraph type="secondary" style={{ fontSize: '14px', marginBottom: '24px', flexGrow: 1 }}>{collection.description}</Paragraph>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '16px' : '0' }}>
                  <Space split={<Text type="secondary">·</Text>}>
                    <Space size={4}><Clock size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.duration}</Text></Space>
                    <Space size={4}><FileText size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.attempts} attempts</Text></Space>
                  </Space>
                  <Button 
                    type="primary" 
                    danger 
                    onClick={() => handleStartPractice(collection)}
                    style={{ borderRadius: '8px', fontWeight: 'bold', width: isMobile ? '100%' : 'auto' }}
                  >
                    Start Practice
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Custom Tests Section */}
      <div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px', gap: isMobile ? '16px' : '0' }}>
          <Title level={4} style={{ margin: 0 }}>My Custom Tests</Title>
          <Space wrap={isMobile}>
            <Button style={{ borderRadius: '8px', width: isMobile ? 'calc(50% - 4px)' : 'auto' }}>View All</Button>
            <Button type="primary" danger icon={<Plus size={16} />} style={{ borderRadius: '8px', fontWeight: 'bold', width: isMobile ? 'calc(50% - 4px)' : 'auto' }}>Create Test</Button>
          </Space>
        </div>
        <Card 
          style={{ 
            borderRadius: '24px', 
            border: '1px dashed #cbd5e1', 
            backgroundColor: '#f8fafc',
            textAlign: 'center',
            padding: isMobile ? '24px 0' : '40px 0'
          }}
        >
          <Empty 
            image={<FileEdit size={isMobile ? 32 : 48} color="#94a3b8" strokeWidth={1} />}
            description={
              <div style={{ padding: isMobile ? '0 16px' : '0' }}>
                <Text strong style={{ display: 'block', fontSize: isMobile ? '14px' : '16px', color: '#475569' }}>No Custom Tests Yet</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>Create your first custom IELTS Writing test with your own topics and diagrams.</Text>
              </div>
            }
          />
        </Card>
      </div>

      {/* All Writing Tasks Section */}
      <div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px', gap: isMobile ? '16px' : '0' }}>
          <Title level={4} style={{ margin: 0 }}>All Writing Tasks</Title>
          <div style={{ 
            backgroundColor: '#f1f5f9', 
            padding: '4px', 
            borderRadius: '12px',
            display: 'flex',
            gap: '4px',
            maxWidth: '100%',
            overflowX: 'auto'
          }}>
            {['All Tests', 'Task 1', 'Task 2', 'Combined'].map(filter => (
              <Button 
                key={filter}
                type={activeFilter === filter ? 'primary' : 'text'}
                onClick={() => setActiveFilter(filter)}
                danger={activeFilter === filter}
                style={{ 
                  borderRadius: '10px', 
                  fontSize: '12px',
                  fontWeight: activeFilter === filter ? 'bold' : 'normal',
                  height: '32px',
                  whiteSpace: 'nowrap'
                }}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
        <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]}>
          {WRITING_COLLECTIONS.filter(c => !c.recommended && (activeFilter === 'All Tests' || c.type === activeFilter)).map(collection => (
            <Col xs={24} md={12} lg={8} key={collection.id}>
              <Card 
                style={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', height: '100%' }}
                bodyStyle={{ padding: isMobile ? '24px' : '32px', display: 'flex', flexDirection: 'column' }}
              >
                <Title level={4} style={{ fontSize: isMobile ? '16px' : '18px', marginBottom: '12px', minHeight: isMobile ? 'auto' : '54px' }}>{collection.title}</Title>
                <Paragraph type="secondary" style={{ fontSize: '14px', marginBottom: '24px', flexGrow: 1 }}>{collection.description}</Paragraph>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '16px' : '0' }}>
                  <Space split={<Text type="secondary">·</Text>}>
                    <Space size={4}><Clock size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.duration}</Text></Space>
                    <Space size={4}><FileText size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.attempts} attempts</Text></Space>
                  </Space>
                  <Button 
                    type="primary" 
                    danger 
                    onClick={() => handleStartPractice(collection)}
                    style={{ borderRadius: '8px', fontWeight: 'bold', width: isMobile ? '100%' : 'auto' }}
                  >
                    Start Practice
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '12px' : '0'
      }}>
        <Button 
          icon={<ArrowLeft size={18} />} 
          type="text" 
          onClick={() => setPageState('listing')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', paddingLeft: 0 }}
        >
          Back to Tasks
        </Button>
        <Space size={isMobile ? 'small' : 'large'} style={{ width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: 'white',
            padding: '6px 12px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <Clock size={16} color="#6B46C1" />
            <Countdown 
              value={deadline} 
              format="mm:ss" 
              valueStyle={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', color: '#6B46C1' }} 
            />
          </div>
          <Button 
            icon={<RefreshCw size={14} />} 
            onClick={handleChangeTopic}
            type="link"
            style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
          >
            New Topic
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card 
            title={<Space><FileEdit size={18} color="#6B46C1" /> <Text strong>Task Prompt</Text></Space>}
            style={{ borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: 'none', position: isMobile ? 'static' : 'sticky', top: '88px' }}
            bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
          >
            <Tag color="purple" style={{ marginBottom: '16px', borderRadius: '4px' }}>{topic.type}</Tag>
            <Paragraph style={{ fontSize: isMobile ? '14px' : '15px', lineHeight: '1.6', color: '#1e293b' }}>{topic.question}</Paragraph>
            <Collapse ghost expandIcon={({ isActive }) => <ChevronRight size={16} style={{ transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />} style={{ marginTop: '24px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <Panel header={<Text strong>Tips & Vocabulary</Text>} key="1">
                <div style={{ padding: '0 8px 8px' }}>
                  <ul style={{ paddingLeft: '20px', marginTop: '12px', marginBottom: '16px' }}>
                    {topic.tips.map((tip, i) => <li key={i} style={{ marginBottom: '6px', color: '#475569', fontSize: '14px' }}>{tip}</li>)}
                  </ul>
                  <Space wrap>
                    {topic.vocabulary.map((word, i) => <Tag key={i} style={{ borderRadius: '6px', backgroundColor: '#f1e8ff', color: '#6B46C1', border: 'none', fontSize: '11px' }}>{word}</Tag>)}
                  </Space>
                </div>
              </Panel>
            </Collapse>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: 'none', height: '100%' }}>
            <TextArea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Start writing your essay here..." 
              style={{ 
                border: 'none', 
                padding: isMobile ? '20px' : '32px', 
                fontSize: isMobile ? '16px' : '17px', 
                lineHeight: '1.8', 
                minHeight: isMobile ? '400px' : '600px', 
                resize: 'none', 
                backgroundColor: '#fff' 
              }} 
            />
            <div style={{ 
              padding: isMobile ? '16px' : '20px 32px', 
              borderTop: '1px solid #f1f5f9', 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'center', 
              backgroundColor: '#fff',
              gap: isMobile ? '16px' : '0'
            }}>
              <Text type="secondary" strong style={{ fontSize: '15px' }}>Words: <span style={{ color: '#6B46C1' }}>{wordCount}</span></Text>
              <Button 
                type="primary" 
                size="large" 
                icon={isSubmitting ? <Spin size="small" /> : <Send size={20} />} 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                style={{ 
                  borderRadius: '12px', 
                  backgroundColor: '#6B46C1', 
                  height: isMobile ? '48px' : '50px', 
                  padding: '0 32px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '10px',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {isSubmitting ? 'Analyzing...' : 'Submit for AI Review'}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderResult = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Button 
        icon={<ArrowLeft size={18} />} 
        type="text" 
        onClick={() => setPageState('editor')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', alignSelf: 'flex-start', paddingLeft: 0 }}
      >
        Back to Editor
      </Button>
      <Card style={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 20px rgba(107, 70, 193, 0.05)' }} bodyStyle={{ padding: isMobile ? '24px' : '32px' }}>
        <Row gutter={[isMobile ? 24 : 32, isMobile ? 24 : 32]} align="middle">
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div style={{ 
              width: isMobile ? '120px' : '160px', 
              height: isMobile ? '120px' : '160px', 
              borderRadius: isMobile ? '30px' : '40px', 
              backgroundColor: '#f3e8ff', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto', 
              transform: 'rotate(-3deg)' 
            }}>
              <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#6B46C1' }}>OVERALL BAND</Text>
              <Title level={1} style={{ margin: 0, color: '#6B46C1', fontSize: isMobile ? '48px' : '64px' }}>{evaluation?.band_score}</Title>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <Title level={4} style={{ marginBottom: '24px', fontSize: isMobile ? '18px' : '20px' }}>Evaluation Summary</Title>
            <Row gutter={[16, 16]}>
              {[
                { label: 'Task Response', score: evaluation?.breakdown.TR },
                { label: 'Coherence', score: evaluation?.breakdown.CC },
                { label: 'Lexical Resource', score: evaluation?.breakdown.LR },
                { label: 'Grammar Accuracy', score: evaluation?.breakdown.GRA },
              ].map((item, idx) => (
                <Col span={isMobile ? 24 : 12} key={idx}>
                  <div style={{ marginBottom: '4px' }}><Text strong style={{ fontSize: '13px' }}>{item.label}</Text></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}><Progress percent={(item.score || 0) * 11} showInfo={false} strokeColor="#6B46C1" size="small"/></div>
                    <Text strong style={{ minWidth: '24px' }}>{item.score}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>

      <Card title="Detailed AI Feedback" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: isMobile ? '16px' : '24px' }}>
        <Paragraph style={{ color: '#475569', fontSize: isMobile ? '14px' : '16px', lineHeight: '1.7' }}>{evaluation?.feedback}</Paragraph>
      </Card>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => setPageState('listing')}
          style={{ borderRadius: '12px', backgroundColor: '#6B46C1', height: isMobile ? '48px' : '54px', padding: '0 40px', fontWeight: '600', width: isMobile ? '100%' : 'auto' }}
        >
          Finish Practice
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '40px' }}>
      {pageState === 'listing' && renderListing()}
      {pageState === 'editor' && renderEditor()}
      {pageState === 'result' && renderResult()}

      <Modal open={isSubmitting} footer={null} closable={false} centered bodyStyle={{ textAlign: 'center', padding: isMobile ? '32px' : '50px' }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: '24px', fontSize: isMobile ? '18px' : '20px' }}>Consulting IELTS Expert AI...</Title>
        <Text type="secondary" style={{ fontSize: isMobile ? '13px' : '14px' }}>Evaluating your vocabulary and grammar structures.</Text>
      </Modal>
    </div>
  );
};

export default WritingPage;
