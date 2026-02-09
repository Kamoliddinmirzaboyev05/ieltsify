import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Tag, Empty, Grid, Row, Col } from 'antd';
import { Clock, Plus, Play } from 'lucide-react';
import { writingTaskManager } from '../services/dataManager';
import WritingSimulator from './WritingSimulator';
import type { WritingTask } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const WritingPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { isDark } = useTheme();
  
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(writingTaskManager.getAll());
  };

  const handleStartTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleBackToList = () => {
    setSelectedTaskId(null);
    loadTasks();
  };

  const filteredTasks = tasks;

  // If a task is selected, show simulator
  if (selectedTaskId) {
    return <WritingSimulator taskId={selectedTaskId} onBack={handleBackToList} />;
  }

  // Otherwise show task list
  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '32px',
        gap: isMobile ? '16px' : '0'
      }}>
        <div>
          <Title level={1} style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', fontWeight: '800' }}>
            ✍️ Writing Practice
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
            Practice IELTS Writing Task 1 & Task 2 with real exam interface
          </Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Plus size={20} />}
          onClick={() => window.location.href = '/dashboard/writing-manager'}
          style={{
            borderRadius: '12px',
            fontWeight: '600',
            height: '48px',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Add New Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        padding: '12px 16px',
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
        borderRadius: '12px',
        border: isDark ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid #3b82f6',
      }}>
        <Text style={{ fontSize: '14px', color: isDark ? '#60a5fa' : '#1e40af', fontWeight: '600' }}>
          💡 Full IELTS Writing Test: Task 1 (20 min, 150+ words) + Task 2 (40 min, 250+ words) = 60 minutes total
        </Text>
      </div>

      {/* Info Card */}
      <Card
        style={{
          borderRadius: '16px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
        }}
        bodyStyle={{ padding: isMobile ? '20px' : '24px' }}
      >
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={4} style={{ color: 'white', margin: 0, marginBottom: '8px' }}>
              Real IELTS Computer-Delivered Interface
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '14px' }}>
              Practice with the exact same interface used in official IELTS computer-delivered tests. 
              Features include: split-screen layout, countdown timer, auto-save, and word counter.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} />
                <Text style={{ color: 'white', fontSize: '13px' }}>Task 1: 20 mins</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} />
                <Text style={{ color: 'white', fontSize: '13px' }}>Task 2: 40 mins</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '60px 20px' }}>
          <Empty
            description={
              <div>
                <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>
                  No Writing Tasks Available
                </Text>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Add writing tasks in Resource Manager to start practicing
                </Text>
              </div>
            }
          />
          <Button
            type="primary"
            size="large"
            icon={<Plus size={20} />}
            onClick={() => window.location.href = '/dashboard/writing-manager'}
            style={{ marginTop: '24px', borderRadius: '12px', fontWeight: '600' }}
          >
            Add Writing Task
          </Button>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredTasks.map((task) => (
            <Col xs={24} sm={12} lg={8} key={task.id}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                  height: '100%',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <Tag
                    color="green"
                    style={{
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Full Test (Task 1 + Task 2)
                  </Tag>
                  {task.task1ImageUrl && (
                    <Tag style={{ borderRadius: '6px', fontSize: '11px' }}>
                      📊 Task 1 has diagram
                    </Tag>
                  )}
                </div>

                <Title level={4} style={{ marginBottom: '12px', fontSize: '16px' }}>
                  {task.title}
                </Title>

                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '16px',
                    minHeight: '40px',
                  }}
                >
                  Task 1: {task.task1Question?.substring(0, 80) || 'No description'}...
                </Paragraph>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f1f5f9',
                }}>
                  <Space size={4}>
                    <Clock size={14} color="#64748b" />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      60 mins total • 400+ words
                    </Text>
                  </Space>
                  <Button
                    type="primary"
                    icon={<Play size={16} />}
                    onClick={() => handleStartTask(task.id)}
                    style={{
                      borderRadius: '8px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Start
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Tips Card */}
      <Card
        style={{
          borderRadius: '16px',
          marginTop: '32px',
          backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : '#fffbeb',
          border: isDark ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid #fbbf24',
        }}
        bodyStyle={{ padding: isMobile ? '16px' : '20px' }}
      >
        <Title level={5} style={{ marginBottom: '12px', fontSize: '16px' }}>
          💡 Writing Tips
        </Title>
        <ul style={{ margin: 0, paddingLeft: '20px', color: isDark ? '#fbbf24' : '#78350f' }}>
          <li style={{ marginBottom: '8px' }}>Full Test: Task 1 (150+ words) + Task 2 (250+ words)</li>
          <li style={{ marginBottom: '8px' }}>Total time: 60 minutes (20 min Task 1, 40 min Task 2)</li>
          <li style={{ marginBottom: '8px' }}>Your work is auto-saved every 30 seconds</li>
          <li>AI will evaluate both tasks and provide detailed feedback</li>
        </ul>
      </Card>
    </div>
  );
};

export default WritingPage;
