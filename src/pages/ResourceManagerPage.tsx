import React, { useState } from 'react';
import { Card, Typography, Button, Input, Select, Upload, message, Space, Tag, Modal, Grid, Row, Col } from 'antd';
import { Upload as UploadIcon, Plus, BookOpen, Headphones, Trash2, ExternalLink, PenTool, FileText } from 'lucide-react';
import { articleManager, listeningManager, vocabularyManager, writingTaskManager } from '../services/dataManager';
import { VOCABULARY_TOPICS } from '../data/vocabularyData';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const ResourceManagerPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { isDark } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'article' | 'listening' | 'writing' | 'vocabulary'>('article');
  
  // Article states (for Smart Article)
  const [articleTitle, setArticleTitle] = useState('');
  const [articleText, setArticleText] = useState('');
  const [articleLevel, setArticleLevel] = useState('');
  const [articleImageUrl, setArticleImageUrl] = useState('');
  
  // Listening states
  const [listeningTitle, setListeningTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [listeningCategory, setListeningCategory] = useState('');
  
  // Writing states
  const [writingTitle, setWritingTitle] = useState('');
  const [task1Question, setTask1Question] = useState('');
  const [task1ImageUrl, setTask1ImageUrl] = useState('');
  const [task2Question, setTask2Question] = useState('');

  // Article handlers (for Smart Article)
  const handleArticleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setArticleImageUrl(url);
    message.success('Rasm yuklandi!');
    return false;
  };

  const handleArticleSubmit = () => {
    if (!articleTitle || !articleText || !articleLevel) {
      message.error('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    articleManager.add({
      title: articleTitle,
      htmlContent: articleText,
      category: 'general',
      difficulty: articleLevel as 'easy' | 'medium' | 'hard',
      tags: [],
    });
    
    message.success('Article qo\'shildi!');
    setArticleTitle('');
    setArticleText('');
    setArticleLevel('');
    setArticleImageUrl('');
  };

  // Listening handlers
  const handleListeningSubmit = () => {
    if (!listeningTitle || !youtubeUrl || !listeningCategory) {
      message.error('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    listeningManager.add({
      title: listeningTitle,
      youtubeUrl: youtubeUrl,
      category: listeningCategory as 'academic' | 'general' | 'podcast' | 'lecture',
      difficulty: 'medium',
    });
    
    message.success('Listening material qo\'shildi!');
    setListeningTitle('');
    setYoutubeUrl('');
    setListeningCategory('');
  };

  // Writing handlers
  const handleTask1ImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setTask1ImageUrl(url);
    message.success('Rasm yuklandi!');
    return false;
  };

  const handleWritingSubmit = () => {
    if (!writingTitle || !task1Question || !task2Question) {
      message.error('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    writingTaskManager.add({
      title: writingTitle,
      task1Question,
      task1ImageUrl: task1ImageUrl || undefined,
      task2Question,
    });

    message.success('Writing task qo\'shildi!');
    setWritingTitle('');
    setTask1Question('');
    setTask1ImageUrl('');
    setTask2Question('');
  };

  // Vocabulary handler
  const handleImportVocabulary = (topicId: string) => {
    const topic = VOCABULARY_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    let imported = 0;
    topic.items.forEach(item => {
      const existing = vocabularyManager.search(item.word);
      if (existing.length === 0) {
        vocabularyManager.add({
          word: item.word,
          definition: item.definition,
          level: item.level,
          masteryLevel: 0,
          examples: item.examples || [],
        });
        imported++;
      }
    });

    message.success(`${imported} ta so'z import qilindi!`);
  };

  // Delete handlers
  const handleDeleteArticle = (id: string) => {
    Modal.confirm({
      title: 'O\'chirish',
      content: 'Rostdan ham o\'chirmoqchimisiz?',
      onOk: () => {
        articleManager.delete(id);
        message.success('O\'chirildi');
      },
    });
  };

  const handleDeleteListening = (id: string) => {
    Modal.confirm({
      title: 'O\'chirish',
      content: 'Rostdan ham o\'chirmoqchimisiz?',
      onOk: () => {
        listeningManager.delete(id);
        message.success('O\'chirildi');
      },
    });
  };

  const handleDeleteWriting = (id: string) => {
    Modal.confirm({
      title: 'O\'chirish',
      content: 'Rostdan ham o\'chirmoqchimisiz?',
      onOk: () => {
        writingTaskManager.delete(id);
        message.success('O\'chirildi');
      },
    });
  };

  const articles = articleManager.getAll();
  const listenings = listeningManager.getAll();
  const writings = writingTaskManager.getAll();

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={1} style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', fontWeight: '800' }}>
          📚 Resource Manager
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
          Barcha materiallarni bir joyda boshqaring
        </Text>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        padding: '4px',
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
        borderRadius: '12px',
        width: 'fit-content',
      }}>
        {[
          { key: 'article', label: 'Article', icon: <FileText size={18} /> },
          { key: 'listening', label: 'Listening', icon: <Headphones size={18} /> },
          { key: 'writing', label: 'Writing', icon: <PenTool size={18} /> },
          { key: 'vocabulary', label: 'Vocabulary', icon: <BookOpen size={18} /> },
        ].map((tab) => (
          <Button
            key={tab.key}
            type={activeTab === tab.key ? 'primary' : 'text'}
            icon={tab.icon}
            onClick={() => setActiveTab(tab.key as 'article' | 'listening' | 'writing' | 'vocabulary')}
            style={{
              borderRadius: '8px',
              fontWeight: activeTab === tab.key ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Article Tab (for Smart Article) */}
      {activeTab === 'article' && (
        <div>
          <Card style={{ borderRadius: '16px', marginBottom: '24px' }}>
            <Title level={3} style={{ marginBottom: '24px' }}>
              <Plus size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Yangi Article (Smart Article uchun)
            </Title>

            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <Text strong>Sarlavha *</Text>
                <Input
                  size="large"
                  placeholder="Masalan: Climate Change"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>Matn *</Text>
                <TextArea
                  rows={8}
                  placeholder="Article matnini kiriting..."
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Text strong>Daraja *</Text>
                  <Select
                    size="large"
                    placeholder="Tanlang"
                    value={articleLevel}
                    onChange={setArticleLevel}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Select.Option value="easy">A1-A2 (Easy)</Select.Option>
                    <Select.Option value="medium">B1-B2 (Medium)</Select.Option>
                    <Select.Option value="hard">C1-C2 (Hard)</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Rasm (ixtiyoriy)</Text>
                  <Upload
                    accept="image/*"
                    beforeUpload={handleArticleImageUpload}
                    maxCount={1}
                    showUploadList={false}
                    style={{ marginTop: '8px' }}
                  >
                    <Button icon={<UploadIcon size={18} />} size="large" block>
                      Rasm yuklash
                    </Button>
                  </Upload>
                  {articleImageUrl && (
                    <Tag color="success" style={{ marginTop: '8px' }}>✓ Rasm yuklandi</Tag>
                  )}
                </Col>
              </Row>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleArticleSubmit}
                style={{ borderRadius: '12px', fontWeight: '600', marginTop: '8px' }}
              >
                Qo'shish
              </Button>
            </Space>
          </Card>

          {/* Existing Articles */}
          <Card style={{ borderRadius: '16px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Mavjud Articlelar ({articles.length})
            </Title>
            {articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Text type="secondary">Hali articlelar yo'q</Text>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    size="small"
                    style={{ 
                      borderRadius: '12px', 
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '16px' }}>{article.title}</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Tag color="blue">{article.difficulty}</Tag>
                          <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                            {new Date(article.uploadDate).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                      <Button
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        O'chirish
                      </Button>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </div>
      )}

      {/* Listening Tab */}
      {activeTab === 'listening' && (
        <div>
          <Card style={{ borderRadius: '16px', marginBottom: '24px' }}>
            <Title level={3} style={{ marginBottom: '24px' }}>
              <Plus size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Yangi Listening Material
            </Title>

            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <Text strong>Nomi *</Text>
                <Input
                  size="large"
                  placeholder="Masalan: IELTS Listening Practice"
                  value={listeningTitle}
                  onChange={(e) => setListeningTitle(e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>YouTube URL *</Text>
                <Input
                  size="large"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <div>
                <Text strong>Kategoriya *</Text>
                <Select
                  size="large"
                  placeholder="Tanlang"
                  value={listeningCategory}
                  onChange={setListeningCategory}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Select.Option value="academic">🎓 Academic</Select.Option>
                  <Select.Option value="general">💬 General</Select.Option>
                  <Select.Option value="podcast">🎙️ Podcast</Select.Option>
                  <Select.Option value="lecture">📚 Lecture</Select.Option>
                </Select>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleListeningSubmit}
                style={{ borderRadius: '12px', fontWeight: '600', marginTop: '8px' }}
              >
                Qo'shish
              </Button>
            </Space>
          </Card>

          {/* Existing Listenings */}
          <Card style={{ borderRadius: '16px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Mavjud Materiallar ({listenings.length})
            </Title>
            {listenings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Text type="secondary">Hali materiallar yo'q</Text>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {listenings.map((listening) => (
                  <Card
                    key={listening.id}
                    size="small"
                    style={{ 
                      borderRadius: '12px', 
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '16px' }}>{listening.title}</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Tag color="purple">{listening.category}</Tag>
                        </div>
                        <a 
                          href={listening.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}
                        >
                          <ExternalLink size={12} />
                          YouTube'da ochish
                        </a>
                      </div>
                      <Button
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDeleteListening(listening.id)}
                      >
                        O'chirish
                      </Button>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </div>
      )}

      {/* Writing Tab */}
      {activeTab === 'writing' && (
        <div>
          <Card style={{ borderRadius: '16px', marginBottom: '24px' }}>
            <Title level={3} style={{ marginBottom: '24px' }}>
              <Plus size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Yangi Writing Task
            </Title>

            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <Text strong>Sarlavha *</Text>
                <Input
                  size="large"
                  placeholder="Masalan: Environment & Technology"
                  value={writingTitle}
                  onChange={(e) => setWritingTitle(e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>

              {/* Task 1 Section */}
              <Card 
                size="small" 
                title="📊 Task 1 (20 min, 150+ so'z)" 
                style={{ 
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.05)' : '#eff6ff',
                  border: isDark ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid #3b82f6'
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <div>
                    <Text strong>Task 1 Savol *</Text>
                    <TextArea
                      rows={4}
                      placeholder="Masalan: The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011..."
                      value={task1Question}
                      onChange={(e) => setTask1Question(e.target.value)}
                      style={{ marginTop: '8px' }}
                    />
                  </div>

                  <div>
                    <Text strong>Task 1 Rasm/Diagram (ixtiyoriy)</Text>
                    <Upload
                      accept="image/*"
                      beforeUpload={handleTask1ImageUpload}
                      maxCount={1}
                      showUploadList={false}
                      style={{ marginTop: '8px' }}
                    >
                      <Button icon={<UploadIcon size={18} />} size="large" block>
                        Rasm yuklash
                      </Button>
                    </Upload>
                    {task1ImageUrl && (
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <img
                          src={task1ImageUrl}
                          alt="Task 1 diagram"
                          style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
                        />
                        <Button
                          size="small"
                          danger
                          onClick={() => setTask1ImageUrl('')}
                          style={{ marginTop: '8px' }}
                        >
                          O'chirish
                        </Button>
                      </div>
                    )}
                  </div>
                </Space>
              </Card>

              {/* Task 2 Section */}
              <Card 
                size="small" 
                title="✍️ Task 2 (40 min, 250+ so'z)" 
                style={{ 
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.05)' : '#f0fdf4',
                  border: isDark ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid #22c55e'
                }}
              >
                <div>
                  <Text strong>Task 2 Savol *</Text>
                  <TextArea
                    rows={4}
                    placeholder="Masalan: Some people believe that technology has made our lives more complicated. Others think it has made life easier. Discuss both views and give your opinion..."
                    value={task2Question}
                    onChange={(e) => setTask2Question(e.target.value)}
                    style={{ marginTop: '8px' }}
                  />
                </div>
              </Card>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleWritingSubmit}
                style={{ borderRadius: '12px', fontWeight: '600', marginTop: '8px' }}
              >
                Qo'shish
              </Button>
            </Space>
          </Card>

          {/* Existing Writings */}
          <Card style={{ borderRadius: '16px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Mavjud Tasklar ({writings.length})
            </Title>
            {writings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Text type="secondary">Hali tasklar yo'q</Text>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {writings.map((writing) => (
                  <Card
                    key={writing.id}
                    size="small"
                    style={{ 
                      borderRadius: '12px', 
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '16px' }}>{writing.title}</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Tag color="green">Full Test</Tag>
                          {writing.task1ImageUrl && <Tag>📊 Task 1 rasm bor</Tag>}
                        </div>
                        {writing.task1ImageUrl && (
                          <div style={{ marginTop: '12px' }}>
                            <img
                              src={writing.task1ImageUrl}
                              alt="Task 1 diagram"
                              style={{
                                maxWidth: '200px',
                                maxHeight: '120px',
                                borderRadius: '8px',
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <Button
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDeleteWriting(writing.id)}
                      >
                        O'chirish
                      </Button>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </div>
      )}

      {/* Vocabulary Tab */}
      {activeTab === 'vocabulary' && (
        <div>
          <Card style={{ borderRadius: '16px', marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
              📖 Vocabulary Mavzulari
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
              {VOCABULARY_TOPICS.length} ta mavzu. Har birini import qiling!
            </Text>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {VOCABULARY_TOPICS.map((topic) => (
              <Card
                key={topic.id}
                style={{ 
                  borderRadius: '16px', 
                  border: isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid #e2e8f0'
                }}
                hoverable
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>{topic.icon}</div>
                  <Title level={4} style={{ margin: 0, fontSize: '18px' }}>{topic.title}</Title>
                  <Text type="secondary">{topic.items.length} ta so'z</Text>
                </div>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => handleImportVocabulary(topic.id)}
                  style={{ borderRadius: '12px', fontWeight: '600' }}
                >
                  Import
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagerPage;
