import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Modal, Input, Card, Typography, Spin } from 'antd';
import { ArrowLeft, ZoomIn, ZoomOut, Clock, Send, ArrowRight, CheckCircle } from 'lucide-react';
import { writingTaskManager, writingSubmissionManager } from '../services/dataManager';
import { evaluateFullWritingTest } from '../services/aiService';
import type { WritingTask } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface WritingSimulatorProps {
  taskId: string;
  onBack: () => void;
}

type Step = 'task1' | 'task2' | 'feedback';

const WritingSimulator: React.FC<WritingSimulatorProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<WritingTask | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('task1');
  
  // Task 1 states
  const [task1Content, setTask1Content] = useState('');
  const [task1TimeLeft, setTask1TimeLeft] = useState(20 * 60); // 20 minutes
  const [task1TimeSpent, setTask1TimeSpent] = useState(0);
  
  // Task 2 states
  const [task2Content, setTask2Content] = useState('');
  const [task2TimeLeft, setTask2TimeLeft] = useState(40 * 60); // 40 minutes
  const [task2TimeSpent, setTask2TimeSpent] = useState(0);
  
  // Feedback states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{
    task1Score: number;
    task1Feedback: string;
    task2Score: number;
    task2Feedback: string;
    overallScore: number;
    overallFeedback: string;
  } | null>(null);
  
  const [imageZoom, setImageZoom] = useState(100);
  const [showImageModal, setShowImageModal] = useState(false);
  const timerInterval = useRef<number | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const loadTask = async () => {
      const loadedTask = await writingTaskManager.getById(taskId);
      if (loadedTask) {
        setTask(loadedTask);
      }
    };
    loadTask();
  }, [taskId]);

  // Block keyboard shortcuts for copy/paste/cut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Cmd+C, Cmd+V, Cmd+X
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        message.warning('Nusxa olish/qo\'yish taqiqlanган!');
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTask1Complete = () => {
    const wordCount = getWordCount(task1Content);
    if (wordCount < 150) {
      Modal.confirm({
        title: 'Ogohlantirish',
        content: `Siz ${wordCount} ta so'z yozdingiz. Minimal talab 150 ta so'z. Davom etmoqchimisiz?`,
        okText: 'Task 2 ga o\'tish',
        cancelText: 'Davom etish',
        onOk: () => {
          setCurrentStep('task2');
        },
      });
    } else {
      message.success('Task 1 tugadi! Task 2 ga o\'tamiz.');
      setCurrentStep('task2');
    }
  };

  const handleTask2Complete = async () => {
    const wordCount = getWordCount(task2Content);
    if (wordCount < 250) {
      Modal.confirm({
        title: 'Ogohlantirish',
        content: `Siz ${wordCount} ta so'z yozdingiz. Minimal talab 250 ta so'z. Yubormoqchimisiz?`,
        okText: 'Yuborish',
        cancelText: 'Davom etish',
        onOk: () => {
          submitFullTest();
        },
      });
    } else {
      submitFullTest();
    }
  };

  useEffect(() => {
    // Start timer based on current step
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    if (currentStep === 'task1') {
      timerInterval.current = window.setInterval(() => {
        setTask1TimeLeft(prev => {
          if (prev <= 0) {
            return 0;
          }
          return prev - 1;
        });
        setTask1TimeSpent(prev => prev + 1);
      }, 1000);
    } else if (currentStep === 'task2') {
      timerInterval.current = window.setInterval(() => {
        setTask2TimeLeft(prev => {
          if (prev <= 0) {
            return 0;
          }
          return prev - 1;
        });
        setTask2TimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [currentStep]);

  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const submitFullTest = async () => {
    if (!task) return;

    setIsEvaluating(true);
    setCurrentStep('feedback');

    try {
      // Call AI evaluation
      const evaluation = await evaluateFullWritingTest(
        task.task1Question,
        task1Content,
        task.task2Question,
        task2Content
      );

      setAiFeedback(evaluation);

      // Save submission
      await writingSubmissionManager.add({
        taskId: task.id,
        task1Content,
        task1WordCount: getWordCount(task1Content),
        task2Content,
        task2WordCount: getWordCount(task2Content),
        totalTimeSpent: task1TimeSpent + task2TimeSpent,
        aiFeedback: evaluation,
      });

      message.success('Test baholandi!');
    } catch (error: any) {
      message.error(error.message || 'Baholashda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
      console.error('Evaluation error:', error);
      setCurrentStep('task2');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleExit = () => {
    Modal.confirm({
      title: 'Testdan chiqish',
      content: 'Rostdan ham chiqmoqchimisiz? Barcha ma\'lumotlar yo\'qoladi.',
      okText: 'Chiqish',
      cancelText: 'Bekor qilish',
      onOk: onBack,
    });
  };

  if (!task) {
    return <div>Yuklanmoqda...</div>;
  }

  const task1WordCount = getWordCount(task1Content);
  const task2WordCount = getWordCount(task2Content);
  const isTask1LowTime = task1TimeLeft <= 300;
  const isTask2LowTime = task2TimeLeft <= 300;

  // Feedback View
  if (currentStep === 'feedback') {
    if (isEvaluating) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? '#0e1626' : '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <Spin size="large" />
          <Text style={{ marginTop: '24px', fontSize: '18px', fontWeight: '600' }}>
            AI baholamoqda...
          </Text>
          <Text type="secondary" style={{ marginTop: '8px' }}>
            Bu bir necha soniya davom etishi mumkin
          </Text>
        </div>
      );
    }

    if (!aiFeedback) {
      return null;
    }

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isDark ? '#0e1626' : '#f8fafc',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '40px 20px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '16px' }} />
            <Title level={1} style={{ margin: 0, fontSize: '32px' }}>
              Test Baholandi!
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              AI professional baholash natijalari
            </Text>
          </div>

          {/* Overall Score */}
          <Card style={{
            borderRadius: '16px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            textAlign: 'center',
          }}>
            <Title level={2} style={{ color: 'white', margin: 0, fontSize: '48px' }}>
              {aiFeedback.overallScore}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
              Umumiy Ball
            </Text>
          </Card>

          {/* Task Scores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, fontSize: '36px', color: '#f6c34a' }}>
                {aiFeedback.task1Score}
              </Title>
              <Text type="secondary">Task 1 Ball</Text>
              <div style={{ marginTop: '8px' }}>
                <Text style={{ fontSize: '12px', color: '#64748b' }}>
                  {task1WordCount} so'z • {Math.floor(task1TimeSpent / 60)} daqiqa
                </Text>
              </div>
            </Card>
            <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, fontSize: '36px', color: '#22c55e' }}>
                {aiFeedback.task2Score}
              </Title>
              <Text type="secondary">Task 2 Ball</Text>
              <div style={{ marginTop: '8px' }}>
                <Text style={{ fontSize: '12px', color: '#64748b' }}>
                  {task2WordCount} so'z • {Math.floor(task2TimeSpent / 60)} daqiqa
                </Text>
              </div>
            </Card>
          </div>

          {/* Task 1 Feedback */}
          <Card style={{ borderRadius: '16px', marginBottom: '16px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              📊 Task 1 Feedback
            </Title>
            <Paragraph style={{ fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {aiFeedback.task1Feedback}
            </Paragraph>
          </Card>

          {/* Task 2 Feedback */}
          <Card style={{ borderRadius: '16px', marginBottom: '16px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              ✍️ Task 2 Feedback
            </Title>
            <Paragraph style={{ fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {aiFeedback.task2Feedback}
            </Paragraph>
          </Card>

          {/* Overall Feedback */}
          <Card style={{ borderRadius: '16px', marginBottom: '32px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              💡 Umumiy Tavsiyalar
            </Title>
            <Paragraph style={{ fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {aiFeedback.overallFeedback}
            </Paragraph>
          </Card>

          {/* Back Button */}
          <Button
            type="primary"
            size="large"
            block
            onClick={onBack}
            style={{
              borderRadius: '12px',
              height: '56px',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            Bosh sahifaga qaytish
          </Button>
        </div>
      </div>
    );
  }

  // Task 1 or Task 2 View
  const isTask1 = currentStep === 'task1';
  const currentContent = isTask1 ? task1Content : task2Content;
  const setCurrentContent = isTask1 ? setTask1Content : setTask2Content;
  const currentTimeLeft = isTask1 ? task1TimeLeft : task2TimeLeft;
  const currentWordCount = isTask1 ? task1WordCount : task2WordCount;
  const minWords = isTask1 ? 150 : 250;
  const isLowTime = isTask1 ? isTask1LowTime : isTask2LowTime;
  const currentQuestion = isTask1 ? task.task1Question : task.task2Question;
  const currentImageUrl = isTask1 ? task.task1ImageUrl : undefined;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f5f5f5',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: isDark ? '#1a1a1a' : '#2c3e50',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <Button
          type="text"
          icon={<ArrowLeft size={20} color="white" />}
          onClick={handleExit}
          style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Chiqish
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '6px 12px',
              backgroundColor: isTask1 ? '#f6c34a' : 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              Task 1
            </div>
            <div style={{
              padding: '6px 12px',
              backgroundColor: !isTask1 ? '#22c55e' : 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              Task 2
            </div>
          </div>

          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: isLowTime ? '#dc2626' : '#d99e1e',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '18px',
          }}>
            <Clock size={20} />
            {formatTime(currentTimeLeft)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* Left Panel - Task Description */}
        <div style={{
          width: '40%',
          backgroundColor: isDark ? '#151f30' : 'white',
          padding: '32px',
          overflowY: 'auto',
          borderRight: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        >
          <div style={{
            backgroundColor: isTask1 ? '#fdf7ea' : '#fdf8ec',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: isTask1 ? '1px solid #f6c34a' : '1px solid #22c55e',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: isTask1 ? '#b8841a' : '#15803d' }}>
              {isTask1 ? 'IELTS Writing Task 1' : 'IELTS Writing Task 2'}
            </div>
            <div style={{ fontSize: '12px', color: isTask1 ? '#f6c34a' : '#22c55e', marginTop: '4px' }}>
              Minimal {minWords} so'z • {isTask1 ? '20' : '40'} daqiqa
            </div>
          </div>

          <div style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: isDark ? '#e2e8f0' : '#1f2937',
            marginBottom: '24px',
          }}>
            {currentQuestion}
          </div>

          {currentImageUrl && (
            <div style={{ marginTop: '24px' }}>
              <div style={{
                border: isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: isDark ? '#0e1626' : '#fafafa',
              }}>
                <img
                  src={currentImageUrl}
                  alt="Task diagram"
                  style={{
                    width: '100%',
                    height: 'auto',
                    cursor: 'pointer',
                    transform: `scale(${imageZoom / 100})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => setShowImageModal(true)}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '12px',
                }}>
                  <Button
                    size="small"
                    icon={<ZoomOut size={16} />}
                    onClick={() => setImageZoom(Math.max(50, imageZoom - 25))}
                  >
                    Kichraytirish
                  </Button>
                  <Button
                    size="small"
                    icon={<ZoomIn size={16} />}
                    onClick={() => setImageZoom(Math.min(200, imageZoom + 25))}
                  >
                    Kattalashtirish
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Text Editor */}
        <div style={{
          width: '60%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: isDark ? '#151f30' : 'white',
        }}>
          <TextArea
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="Yozishni boshlang..."
            spellCheck={false}
            onCopy={(e) => {
              e.preventDefault();
              message.warning('Nusxa olish taqiqlanган!');
              return false;
            }}
            onCut={(e) => {
              e.preventDefault();
              message.warning('Kesish taqiqlanган!');
              return false;
            }}
            onPaste={(e) => {
              e.preventDefault();
              message.warning('Qo\'yish taqiqlanган!');
              return false;
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              return false;
            }}
            style={{
              flex: 1,
              border: 'none',
              padding: '32px',
              fontSize: '16px',
              lineHeight: '1.8',
              fontFamily: 'Arial, sans-serif',
              resize: 'none',
              outline: 'none',
              backgroundColor: isDark ? '#151f30' : 'white',
              color: isDark ? '#e2e8f0' : '#1f2937',
            }}
          />

          {/* Footer */}
          <div style={{
            padding: '16px 32px',
            borderTop: isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#0e1626' : '#fafafa',
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: currentWordCount < minWords ? '#dc2626' : '#d99e1e',
            }}>
              So'zlar soni: {currentWordCount} / {minWords}
            </div>

            <Button
              type="primary"
              size="large"
              icon={isTask1 ? <ArrowRight size={20} /> : <Send size={20} />}
              onClick={isTask1 ? handleTask1Complete : handleTask2Complete}
              disabled={currentWordCount === 0}
              style={{
                backgroundColor: isTask1 ? '#f6c34a' : '#22c55e',
                borderRadius: '8px',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {isTask1 ? 'Task 2 ga o\'tish' : 'Yuborish'}
            </Button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        open={showImageModal}
        onCancel={() => setShowImageModal(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
      >
        {currentImageUrl && (
          <img
            src={currentImageUrl}
            alt="Task diagram - Full size"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default WritingSimulator;
