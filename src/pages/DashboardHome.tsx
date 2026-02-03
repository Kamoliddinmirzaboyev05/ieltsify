import React, { useState } from 'react';
import { Card, Button, Typography, Input, Progress, Space, Tag, Spin, message, Avatar } from 'antd';
import { Edit2, Send, ChevronRight, CheckCircle2, Clock, User } from 'lucide-react';
import { USER_STATS, TASKS } from '../mockData';
import { sendMessageToGemini, type ChatMessage } from '../services/aiService';

const { Title, Text, Paragraph } = Typography;

const DashboardHome: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    const currentInput = userInput;
    setUserInput('');

    try {
      const response = await sendMessageToGemini(currentInput);
      const assistantMsg: ChatMessage = { 
        role: response.startsWith('Sorry, I encountered an error') ? 'error' : 'model', 
        text: response 
      };
      setMessages(prev => [...prev, assistantMsg]);
      
      if (assistantMsg.role === 'error') {
        message.error("Failed to get a response from Catbot.");
      }
    } catch (err) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Section A: Usage Limit Card */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
          borderRadius: '16px',
          border: 'none',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              {USER_STATS.reportsUsed}/{USER_STATS.dailyLimit} daily free reports used
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <Clock size={14} /> Renews in {USER_STATS.renewsIn}
            </Text>
          </div>
          <Button 
            type="primary" 
            style={{ 
              backgroundColor: 'white', 
              color: '#6B46C1', 
              border: 'none', 
              fontWeight: '600',
              borderRadius: '8px',
              marginTop: '12px'
            }}
          >
            Upgrade to premium
          </Button>
        </div>
      </Card>

      {/* Section B: Target Score Card */}
      <Card style={{ borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {USER_STATS.targetType}
            </Text>
            <Title level={5} style={{ margin: '4px 0 0 0' }}>
              Target Scores: Overall {USER_STATS.targetOverall.toFixed(1)}
            </Title>
          </div>
          <Button type="text" icon={<Edit2 size={18} style={{ color: '#6B46C1' }} />} />
        </div>
      </Card>

      {/* Section C: Hero / Chat Interface */}
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#f3e8ff', 
          borderRadius: '24px', 
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '40px' }}>🐱</span>
        </div>
        <Title level={2} style={{ margin: '0 0 8px 0' }}>Hey, I'm Catbot!</Title>
        <Paragraph type="secondary" style={{ fontSize: '16px' }}>
          I'm here to make IELTS prep fun and effective for you. Ask me anything!
        </Paragraph>

        {/* Chat History Display */}
        {messages.length > 0 && (
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto 24px', 
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '10px'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                {msg.role !== 'user' && (
                  <Avatar size="small" style={{ backgroundColor: '#f3e8ff' }}>🐱</Avatar>
                )}
                <div style={{ 
                  maxWidth: '80%', 
                  padding: '10px 16px', 
                  borderRadius: '16px',
                  backgroundColor: msg.role === 'user' ? '#6B46C1' : msg.role === 'error' ? '#fee2e2' : '#f1f5f9',
                  color: msg.role === 'user' ? 'white' : '#1e293b',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <Avatar size="small" icon={<User size={14} />} style={{ backgroundColor: '#e2e8f0' }} />
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <Input
            size="large"
            placeholder="Ask anything in your language..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onPressEnter={handleSendMessage}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
            }}
            suffix={
              isLoading ? (
                <Spin size="small" />
              ) : (
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<Send size={18} />} 
                  onClick={handleSendMessage}
                  style={{ backgroundColor: '#6B46C1', border: 'none' }} 
                />
              )
            }
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
            <Tag color="purple" style={{ borderRadius: '12px', padding: '2px 12px', cursor: 'pointer' }} onClick={() => setUserInput("How to start IELTS prep?")}>Ask</Tag>
            <Tag style={{ borderRadius: '12px', padding: '2px 12px', cursor: 'pointer' }} onClick={() => setUserInput("Learn IELTS Writing tips")}>Learn</Tag>
            <Tag style={{ borderRadius: '12px', padding: '2px 12px', cursor: 'pointer' }} onClick={() => setUserInput("Support with registration")}>Support</Tag>
          </div>
        </div>
      </div>

      {/* Section D: Getting Started Progress */}
      <Card title="Getting Started" style={{ borderRadius: '16px' }} extra={<Tag color="purple">50% Complete</Tag>}>
        <Progress percent={50} strokeColor="#6B46C1" showInfo={false} style={{ marginBottom: '24px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {TASKS.map((task) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                {task.completed ? (
                  <CheckCircle2 color="#10b981" size={20} />
                ) : (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #e2e8f0' }} />
                )}
                <Text style={{ color: task.completed ? '#64748b' : '#1e293b', textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </Text>
              </Space>
              {!task.completed && (
                <Button type="text" icon={<ChevronRight size={18} />} />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;
