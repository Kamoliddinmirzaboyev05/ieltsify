import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Button, 
  Segmented, 
  Space, 
  Avatar, 
  notification,
  Spin,
  Tag
} from 'antd';
import { 
  Mic, 
  MicOff, 
  SkipForward, 
  MessageSquare,
  User,
  History
} from 'lucide-react';
import { SPEAKING_QUESTIONS } from '../mockData';

const { Title, Text, Paragraph } = Typography;

type RecordingState = 'idle' | 'recording' | 'processing';

const SpeakingPage: React.FC = () => {
  const [part, setPart] = useState<1 | 2 | 3>(1);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const filteredQuestions = SPEAKING_QUESTIONS.filter(q => q.part === part);
  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleModeChange = (value: string | number) => {
    const newPart = value as 1 | 2 | 3;
    setPart(newPart);
    setCurrentQuestionIndex(0);
    setRecordingState('idle');
  };

  const handleToggleRecording = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
    } else if (recordingState === 'recording') {
      setRecordingState('processing');
      setTimeout(() => {
        setRecordingState('idle');
        notification.success({
          message: 'Answer recorded!',
          description: 'AI is analyzing your speaking fluency and pronunciation...',
          placement: 'topRight',
          duration: 3,
        });
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % filteredQuestions.length;
    setCurrentQuestionIndex(nextIndex);
    setRecordingState('idle');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px 0' }}>
      {/* 1. Mode Selection */}
      <div style={{ textAlign: 'center' }}>
        <Segmented
          size="large"
          value={part}
          options={[
            { label: 'Part 1 (Interview)', value: 1 },
            { label: 'Part 2 (Cue Card)', value: 2 },
            { label: 'Part 3 (Discussion)', value: 3 },
          ]}
          onChange={handleModeChange}
          style={{ 
            borderRadius: '12px', 
            padding: '4px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        />
      </div>

      {/* 2. Main Stage */}
      <Card 
        style={{ 
          borderRadius: '24px', 
          textAlign: 'center', 
          padding: '40px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
          border: 'none',
          backgroundColor: '#ffffff'
        }}
      >
        <Space direction="vertical" size={32} style={{ width: '100%' }}>
          {/* Examiner Avatar */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar 
              size={100} 
              icon={<User size={50} />} 
              style={{ 
                backgroundColor: '#f3e8ff', 
                color: '#6B46C1',
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(107, 70, 193, 0.2)'
              }} 
            />
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 5, 
              width: 20, 
              height: 20, 
              backgroundColor: '#10b981', 
              borderRadius: '50%', 
              border: '3px solid #fff' 
            }} />
          </div>

          <div>
            <Tag color="#6B46C1" style={{ borderRadius: '4px', marginBottom: '8px' }}>AI EXAMINER</Tag>
            <Title level={3} style={{ margin: '8px 0', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              "{currentQuestion?.question}"
            </Title>
          </div>

          {/* Microphone Central Button */}
          <div style={{ marginTop: '20px' }}>
            <div className={recordingState === 'recording' ? 'recording-indicator' : ''} style={{ width: '100px', height: '100px', margin: '0 auto' }}>
              <Button
                onClick={handleToggleRecording}
                style={{
                  width: '100px',
                  height: '100px',
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
                  boxShadow: '0 8px 16px rgba(107, 70, 193, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {recordingState === 'processing' ? (
                  <Spin size="large" style={{ color: 'white' }} />
                ) : recordingState === 'recording' ? (
                  <MicOff size={40} />
                ) : (
                  <Mic size={40} />
                )}
              </Button>
            </div>
            <Text strong style={{ display: 'block', marginTop: '16px', color: recordingState === 'recording' ? '#ef4444' : '#64748b' }}>
              {recordingState === 'recording' ? 'Listening...' : recordingState === 'processing' ? 'Analyzing...' : 'Click to start speaking'}
            </Text>
          </div>
        </Space>
      </Card>

      {/* 3. Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <Button 
          icon={<SkipForward size={18} />} 
          size="large" 
          onClick={handleNextQuestion}
          style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Next Question
        </Button>
        <Button 
          icon={<History size={18} />} 
          size="large" 
          onClick={() => setShowTranscript(!showTranscript)}
          style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
        </Button>
      </div>

      {/* 4. Transcript Area */}
      {showTranscript && (
        <Card style={{ borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#6B46C1" />
            What you said (Transcript)
          </Title>
          <Paragraph italic style={{ color: '#475569', fontSize: '16px', marginTop: '12px' }}>
            "Actually, I come from a small town in the southern part of the country. It's famous for its beautiful landscapes and friendly residents. I've lived there for most of my life before moving to the city for my studies..."
          </Paragraph>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            * This is a mock transcript of your response.
          </Text>
        </Card>
      )}
    </div>
  );
};

export default SpeakingPage;
