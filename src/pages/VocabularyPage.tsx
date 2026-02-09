import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Button, Space, Tag, Progress, Modal, Form, Select, Row, Col, Empty, Tooltip, Grid } from 'antd';
import { Search, Plus, Volume2, Trash2, Edit, BookOpen, TrendingUp } from 'lucide-react';
import { vocabularyManager } from '../services/dataManager';
import { ttsService } from '../services/ttsService';
import type { VocabularyWord } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const VocabularyPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = () => {
    setWords(vocabularyManager.getAll());
  };

  const handleAddWord = (values: any) => {
    if (editingWord) {
      vocabularyManager.update(editingWord.id, values);
    } else {
      vocabularyManager.add({
        ...values,
        masteryLevel: 0,
      });
    }
    loadWords();
    setIsModalOpen(false);
    setEditingWord(null);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Word',
      content: 'Are you sure you want to delete this word?',
      onOk: () => {
        vocabularyManager.delete(id);
        loadWords();
      },
    });
  };

  const handleSpeak = (word: string, definition: string) => {
    ttsService.speak(`${word}. ${definition}`);
  };

  const handleEdit = (word: VocabularyWord) => {
    setEditingWord(word);
    form.setFieldsValue(word);
    setIsModalOpen(true);
  };

  const updateMastery = (id: string, increment: number) => {
    const word = words.find(w => w.id === id);
    if (word) {
      const newMastery = Math.max(0, Math.min(100, word.masteryLevel + increment));
      vocabularyManager.update(id, {
        masteryLevel: newMastery,
        lastReviewed: new Date().toISOString(),
        reviewCount: word.reviewCount + 1,
      });
      loadWords();
    }
  };

  const filteredWords = searchQuery
    ? words.filter(w =>
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.definition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : words;

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: '#22c55e',
      A2: '#3b82f6',
      B1: '#f59e0b',
      B2: '#ef4444',
      C1: '#8b5cf6',
      C2: '#ec4899',
    };
    return colors[level] || '#64748b';
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '24px',
        gap: isMobile ? '16px' : '0'
      }}>
        <div>
          <Title level={1} style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', fontWeight: '800' }}>
            <BookOpen size={isMobile ? 28 : 32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Vocabulary
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
            {words.length} words in your collection
          </Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Plus size={20} />}
          onClick={() => {
            setEditingWord(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          style={{
            borderRadius: '12px',
            fontWeight: '600',
            height: '48px',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Add Word
        </Button>
      </div>

      {/* Search */}
      <Input
        size="large"
        placeholder="Search vocabulary..."
        prefix={<Search size={20} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          borderRadius: '12px',
          marginBottom: '24px',
        }}
      />

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Total Words</Text>
            <Title level={3} style={{ margin: '8px 0 0 0' }}>{words.length}</Title>
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Mastered</Text>
            <Title level={3} style={{ margin: '8px 0 0 0', color: '#22c55e' }}>
              {words.filter(w => w.masteryLevel >= 80).length}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Avg Mastery</Text>
            <Title level={3} style={{ margin: '8px 0 0 0', color: '#3b82f6' }}>
              {words.length > 0 ? Math.round(words.reduce((sum, w) => sum + w.masteryLevel, 0) / words.length) : 0}%
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Word List */}
      {filteredWords.length === 0 ? (
        <Empty
          description="No words found"
          style={{ marginTop: '60px' }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredWords.map((word) => (
            <Col xs={24} sm={12} lg={8} key={word.id}>
              <Card
                style={{
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  height: '100%',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <Title level={4} style={{ margin: 0, fontSize: '20px' }}>
                      {word.word}
                    </Title>
                    <Tag
                      color={getLevelColor(word.level)}
                      style={{ marginTop: '8px', borderRadius: '6px', fontSize: '11px' }}
                    >
                      {word.level}
                    </Tag>
                  </div>
                  <Space>
                    <Tooltip title="Speak">
                      <Button
                        type="text"
                        icon={<Volume2 size={18} />}
                        onClick={() => handleSpeak(word.word, word.definition)}
                      />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        icon={<Edit size={18} />}
                        onClick={() => handleEdit(word)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 size={18} />}
                        onClick={() => handleDelete(word.id)}
                      />
                    </Tooltip>
                  </Space>
                </div>

                <Paragraph
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '16px',
                    minHeight: '60px',
                  }}
                  ellipsis={{ rows: 3 }}
                >
                  {word.definition}
                </Paragraph>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <Text style={{ fontSize: '12px', fontWeight: '600' }}>
                      <TrendingUp size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Mastery
                    </Text>
                    <Text style={{ fontSize: '12px', fontWeight: '600' }}>{word.masteryLevel}%</Text>
                  </div>
                  <Progress
                    percent={word.masteryLevel}
                    strokeColor={{
                      '0%': '#ef4444',
                      '50%': '#f59e0b',
                      '100%': '#22c55e',
                    }}
                    showInfo={false}
                    strokeWidth={6}
                  />
                </div>

                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    onClick={() => updateMastery(word.id, -10)}
                    style={{ borderRadius: '8px' }}
                  >
                    Need Review
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => updateMastery(word.id, 10)}
                    style={{ borderRadius: '8px' }}
                  >
                    Got It!
                  </Button>
                </Space>

                <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '12px' }}>
                  Reviewed {word.reviewCount} times
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={editingWord ? 'Edit Word' : 'Add New Word'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingWord(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddWord}
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            name="word"
            label="Word"
            rules={[{ required: true, message: 'Please enter the word' }]}
          >
            <Input size="large" placeholder="e.g., Eloquent" />
          </Form.Item>

          <Form.Item
            name="definition"
            label="Definition"
            rules={[{ required: true, message: 'Please enter the definition' }]}
          >
            <TextArea
              rows={4}
              placeholder="e.g., Fluent or persuasive in speaking or writing"
            />
          </Form.Item>

          <Form.Item
            name="level"
            label="CEFR Level"
            rules={[{ required: true, message: 'Please select a level' }]}
          >
            <Select size="large" placeholder="Select level">
              <Select.Option value="A1">A1 - Beginner</Select.Option>
              <Select.Option value="A2">A2 - Elementary</Select.Option>
              <Select.Option value="B1">B1 - Intermediate</Select.Option>
              <Select.Option value="B2">B2 - Upper Intermediate</Select.Option>
              <Select.Option value="C1">C1 - Advanced</Select.Option>
              <Select.Option value="C2">C2 - Proficiency</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="examples" label="Example Sentences (Optional)">
            <TextArea
              rows={3}
              placeholder="Enter example sentences, one per line"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingWord ? 'Update' : 'Add'} Word
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VocabularyPage;
