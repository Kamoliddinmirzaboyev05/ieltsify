import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Segmented, 
  Space, 
  Avatar, 
  Spin,
  Tag,
  message,
  Row,
  Col
} from 'antd';
import { 
  Mic, 
  MicOff, 
  SkipForward, 
  MessageSquare,
  User,
  History,
  Lightbulb,
  Award,
  BarChart3,
  Medal,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { SPEAKING_QUESTIONS, SPEAKING_COLLECTIONS, SPEAKING_STATS, type SpeakingCollection } from '../mockData';
import { evaluateSpeaking, type SpeakingEvaluation } from '../services/aiService';

const { Title, Text, Paragraph } = Typography;

type RecordingState = 'idle' | 'recording' | 'processing';
type PageState = 'listing' | 'practice' | 'result';

const SpeakingPage: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>('listing');
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);

  // Mock transcript for MVP
  const mockTranscript = "Actually, I come from a small town in the southern part of the country. It's famous for its beautiful landscapes and friendly residents. I've lived there for most of my life before moving to the city for my studies.";

  const filteredQuestions = SPEAKING_QUESTIONS.filter(q => q.part === part);
  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleStartPractice = (_collection: SpeakingCollection) => {
    setPageState('practice');
    setPart(1);
    setCurrentQuestionIndex(0);
    setEvaluation(null);
  };

  const handleModeChange = (value: string | number) => {
    const newPart = value as 1 | 2 | 3;
    setPart(newPart);
    setCurrentQuestionIndex(0);
    setRecordingState('idle');
    setEvaluation(null);
  };

  const handleToggleRecording = async () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
    } else if (recordingState === 'recording') {
      setRecordingState('processing');
      try {
        const result = await evaluateSpeaking(currentQuestion.question, mockTranscript);
        setEvaluation(result);
        setPageState('result');
        message.success("Speaking analysis complete!");
      } catch (error) {
        message.error("Failed to analyze speaking. Please try again.");
      } finally {
        setRecordingState('idle');
      }
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % filteredQuestions.length;
    setCurrentQuestionIndex(nextIndex);
    setRecordingState('idle');
    setEvaluation(null);
  };

  const renderListing = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        {[
          { label: 'Total Submissions', value: SPEAKING_STATS.totalSubmissions, subText: 'Practice sessions', icon: <Mic size={20} color="#ef4444" />, bg: '#fff1f2' },
          { label: 'Average Score', value: SPEAKING_STATS.averageScore.toFixed(1), subText: 'Overall band', icon: <BarChart3 size={20} color="#3b82f6" />, bg: '#eff6ff' },
          { label: 'Highest Score', value: SPEAKING_STATS.highestScore.toFixed(1), subText: 'Best result', icon: <Medal size={20} color="#22c55e" />, bg: '#f0fdf4' },
          { label: 'Practice Minutes', value: SPEAKING_STATS.practiceMinutes, subText: 'Total practice time', icon: <Clock size={20} color="#a855f7" />, bg: '#faf5ff' },
        ].map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <Text type="secondary" strong style={{ fontSize: '12px', display: 'block' }}>{stat.label}</Text>
                  <Title level={2} style={{ margin: '4px 0 0 0', fontSize: '28px' }}>{stat.value}</Title>
                  <Text type="secondary" style={{ fontSize: '13px' }}>{stat.subText}</Text>
                </div>
                <div style={{ padding: '10px', backgroundColor: stat.bg, borderRadius: '50%', display: 'flex' }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recommended Section */}
      <div>
        <Title level={4} style={{ marginBottom: '24px' }}>Recommended Tests</Title>
        <Row gutter={[24, 24]}>
          {SPEAKING_COLLECTIONS.filter(c => c.recommended).map(collection => (
            <Col xs={24} md={12} lg={8} key={collection.id}>
              <Card 
                style={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', height: '100%' }}
                bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column' }}
              >
                <Tag color="blue" style={{ width: 'fit-content', borderRadius: '20px', padding: '2px 12px', border: 'none', backgroundColor: '#eff6ff', color: '#3b82f6', marginBottom: '16px', fontWeight: 'bold' }}>
                  Recommended
                </Tag>
                <Title level={4} style={{ fontSize: '18px', marginBottom: '12px', minHeight: '54px' }}>{collection.title}</Title>
                <Paragraph type="secondary" style={{ fontSize: '14px', marginBottom: '24px', flexGrow: 1 }}>{collection.description}</Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <Space split={<Text type="secondary">·</Text>}>
                    <Space size={4}><Clock size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.duration}</Text></Space>
                    <Space size={4}><Mic size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.attempts} attempts</Text></Space>
                  </Space>
                  <Button 
                    type="primary" 
                    danger 
                    onClick={() => handleStartPractice(collection)}
                    style={{ borderRadius: '8px', fontWeight: 'bold' }}
                  >
                    Start Practice
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* All Tests Section */}
      <div>
        <Title level={4} style={{ marginBottom: '24px' }}>All Speaking Tests</Title>
        <Row gutter={[24, 24]}>
          {SPEAKING_COLLECTIONS.filter(c => !c.recommended).map(collection => (
            <Col xs={24} md={12} lg={8} key={collection.id}>
              <Card 
                style={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', height: '100%' }}
                bodyStyle={{ padding: '32px', display: 'flex', flexDirection: 'column' }}
              >
                <Title level={4} style={{ fontSize: '18px', marginBottom: '12px', minHeight: '54px' }}>{collection.title}</Title>
                <Paragraph type="secondary" style={{ fontSize: '14px', marginBottom: '24px', flexGrow: 1 }}>{collection.description}</Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <Space split={<Text type="secondary">·</Text>}>
                    <Space size={4}><Clock size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.duration}</Text></Space>
                    <Space size={4}><Mic size={14} color="#64748b" /><Text type="secondary" style={{ fontSize: '12px' }}>{collection.attempts} attempts</Text></Space>
                  </Space>
                  <Button 
                    type="primary" 
                    danger 
                    onClick={() => handleStartPractice(collection)}
                    style={{ borderRadius: '8px', fontWeight: 'bold' }}
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

  const renderPractice = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          icon={<ArrowLeft size={18} />} 
          type="text" 
          onClick={() => setPageState('listing')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
        >
          Back to Tests
        </Button>
        <Segmented
          size="large"
          value={part}
          options={[
            { label: 'Part 1', value: 1 },
            { label: 'Part 2', value: 2 },
            { label: 'Part 3', value: 3 },
          ]}
          onChange={handleModeChange}
          style={{ 
            borderRadius: '16px', 
            padding: '4px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        />
        <div style={{ width: '100px' }} /> {/* Spacer */}
      </div>

      <Card 
        style={{ 
          borderRadius: '32px', 
          textAlign: 'center', 
          padding: '60px 20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
          border: 'none',
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(at 0% 0%, rgba(107, 70, 193, 0.03) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(107, 70, 193, 0.03) 0, transparent 50%)'
        }}
      >
        <Space direction="vertical" size={40} style={{ width: '100%' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar 
              size={120} 
              icon={<User size={60} />} 
              style={{ 
                backgroundColor: '#f3e8ff', 
                color: '#6B46C1',
                border: '6px solid #fff',
                boxShadow: '0 10px 25px rgba(107, 70, 193, 0.15)'
              }} 
            />
            <div style={{ 
              position: 'absolute', 
              bottom: 5, 
              right: 10, 
              width: 24, 
              height: 24, 
              backgroundColor: '#10b981', 
              borderRadius: '50%', 
              border: '4px solid #fff' 
            }} />
          </div>

          <div>
            <Tag color="#6B46C1" style={{ borderRadius: '6px', padding: '2px 12px', fontWeight: 'bold' }}>IELTS EXAMINER</Tag>
            <Title level={2} style={{ margin: '16px 0', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
              "{currentQuestion?.question}"
            </Title>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div className={recordingState === 'recording' ? 'recording-indicator' : ''} style={{ width: '120px', height: '120px', margin: '0 auto' }}>
              <Button
                onClick={handleToggleRecording}
                disabled={recordingState === 'processing'}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: recordingState === 'recording' ? '#ef4444' : '#6B46C1',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: recordingState === 'recording' ? '0 0 30px rgba(239, 68, 68, 0.4)' : '0 12px 24px rgba(107, 70, 193, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                {recordingState === 'processing' ? (
                  <Spin size="large" style={{ color: 'white' }} />
                ) : recordingState === 'recording' ? (
                  <MicOff size={48} />
                ) : (
                  <Mic size={48} />
                )}
              </Button>
            </div>
            <Text strong style={{ display: 'block', marginTop: '24px', fontSize: '16px', color: recordingState === 'recording' ? '#ef4444' : '#64748b' }}>
              {recordingState === 'recording' ? 'Recording your answer...' : recordingState === 'processing' ? 'Processing answer...' : 'Click to start speaking'}
            </Text>
          </div>
        </Space>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Button 
          icon={<SkipForward size={20} />} 
          size="large" 
          onClick={handleNextQuestion}
          style={{ borderRadius: '14px', height: '54px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          Skip Question
        </Button>
        <Button 
          icon={<History size={20} />} 
          size="large" 
          onClick={() => setShowTranscript(!showTranscript)}
          style={{ borderRadius: '14px', height: '54px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {showTranscript ? 'Hide History' : 'View History'}
        </Button>
      </div>

      {showTranscript && (
        <Card style={{ borderRadius: '24px', border: 'none', backgroundColor: '#f8fafc', padding: '12px' }}>
          <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="#6B46C1" />
            Previous Response Transcript
          </Title>
          <Paragraph italic style={{ color: '#475569', fontSize: '16px', marginTop: '16px', lineHeight: '1.7' }}>
            "{mockTranscript}"
          </Paragraph>
        </Card>
      )}
    </div>
  );

  const renderResult = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card 
        style={{ borderRadius: '32px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', backgroundColor: '#fff' }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '40px', 
            backgroundColor: '#f3e8ff', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            transform: 'rotate(5deg)'
          }}>
            <Award size={24} color="#6B46C1" />
            <Title level={1} style={{ margin: 0, color: '#6B46C1', fontSize: '48px' }}>{evaluation?.band_score}</Title>
            <Text strong style={{ fontSize: '10px', color: '#6B46C1', letterSpacing: '1px' }}>BAND SCORE</Text>
          </div>
          <Title level={3}>Speech Analysis Result</Title>
          <Text type="secondary">Based on your latest response to the examiner's question.</Text>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={14}>
            <Card 
              title={<Space><MessageSquare size={18} color="#6B46C1" /> Feedback</Space>} 
              style={{ borderRadius: '20px', height: '100%', background: '#f8fafc', border: 'none' }}
            >
              <Paragraph style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
                {evaluation?.feedback}
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card 
              title={<Space><Lightbulb size={18} color="#eab308" /> Vocabulary Boost</Space>} 
              style={{ borderRadius: '20px', height: '100%', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
            >
              <Paragraph type="secondary" style={{ fontSize: '14px', marginBottom: '20px' }}>
                Try using these advanced words to increase your score:
              </Paragraph>
              <Space wrap size={[8, 12]}>
                {evaluation?.better_vocabulary.map((word, idx) => (
                  <Tag 
                    key={idx} 
                    color="purple" 
                    style={{ 
                      borderRadius: '8px', 
                      padding: '6px 16px', 
                      fontSize: '14px', 
                      border: 'none',
                      backgroundColor: '#f3e8ff',
                      color: '#6B46C1',
                      fontWeight: '600'
                    }}
                  >
                    {word}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => setPageState('practice')}
            style={{ 
              borderRadius: '12px', 
              height: '54px', 
              padding: '0 40px', 
              backgroundColor: '#6B46C1',
              fontWeight: '600'
            }}
          >
            Continue Practice
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: '20px 0' }}>
      {pageState === 'listing' && renderListing()}
      {pageState === 'practice' && renderPractice()}
      {pageState === 'result' && renderResult()}
    </div>
  );
};

export default SpeakingPage;
