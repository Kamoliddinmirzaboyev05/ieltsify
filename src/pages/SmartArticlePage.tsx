import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Space, Modal, message, Empty, Grid } from 'antd';
import { BookOpen, Plus, Volume2, Sparkles } from 'lucide-react';
import { articleManager, vocabularyManager } from '../services/dataManager';
import { ttsService } from '../services/ttsService';
import type { Article } from '../types';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface ContextMenuPosition {
  x: number;
  y: number;
  selectedText: string;
}

const SmartArticlePage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    // Add mouseup listener for text selection
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0 && contentRef.current?.contains(selection?.anchorNode || null)) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          setContextMenu({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            selectedText: text,
          });
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.context-menu')) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const loadArticles = () => {
    setArticles(articleManager.getAll());
  };

  const handleAddToVocabulary = () => {
    if (!contextMenu) return;

    const word = contextMenu.selectedText;
    
    // Check if word already exists
    const existing = vocabularyManager.search(word);
    if (existing.length > 0) {
      message.info('This word is already in your vocabulary!');
      setContextMenu(null);
      return;
    }

    vocabularyManager.add({
      word: word,
      definition: 'Definition to be added',
      level: 'B1',
      masteryLevel: 0,
    });

    message.success(`"${word}" added to vocabulary!`);
    setContextMenu(null);
  };

  const handleTranslateDefine = async () => {
    if (!contextMenu) return;

    setIsAnalyzing(true);
    
    // Mock API call - replace with actual translation API
    setTimeout(() => {
      const mockDefinition = `"${contextMenu.selectedText}" - A sophisticated word commonly used in academic contexts. This term appears frequently in IELTS reading passages.`;
      
      Modal.info({
        title: 'Definition & Translation',
        content: mockDefinition,
        width: 500,
      });
      
      setIsAnalyzing(false);
      setContextMenu(null);
    }, 1000);
  };

  const handleSpeak = () => {
    if (!contextMenu) return;
    ttsService.speak(contextMenu.selectedText);
    setContextMenu(null);
  };

  const analyzeArticle = async () => {
    if (!selectedArticle) return;

    setIsAnalyzing(true);
    
    // Mock AI analysis - replace with actual AI service
    setTimeout(() => {
      const analysis = `
**Article Analysis**

**Difficulty Level:** ${selectedArticle.difficulty.toUpperCase()}

**Key Vocabulary:**
- Sophisticated academic terms
- Complex sentence structures
- Advanced linking words

**Main Ideas:**
1. Introduction to the topic
2. Supporting arguments
3. Conclusion and implications

**IELTS Relevance:**
This article contains vocabulary and structures commonly found in IELTS Academic Reading passages. Focus on understanding the main ideas and supporting details.

**Recommended Practice:**
- Identify topic sentences
- Practice skimming and scanning
- Note down unfamiliar vocabulary
      `;
      
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1500);
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
            Smart Article Reader
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
            Highlight text for instant definitions and vocabulary building
          </Text>
        </div>
      </div>

      {!selectedArticle ? (
        <div>
          <Title level={4} style={{ marginBottom: '16px' }}>Select an Article</Title>
          {articles.length === 0 ? (
            <Empty
              description="No articles available. Upload articles in Resource Manager."
              style={{ marginTop: '60px' }}
            />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              {articles.map((article) => (
                <Card
                  key={article.id}
                  hoverable
                  onClick={() => setSelectedArticle(article)}
                  style={{ borderRadius: '16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Title level={4} style={{ margin: 0 }}>{article.title}</Title>
                      <Space style={{ marginTop: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {article.category}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          • {article.difficulty}
                        </Text>
                      </Space>
                    </div>
                    <Button type="primary" style={{ borderRadius: '8px' }}>
                      Read
                    </Button>
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Article Content */}
          <Card
            style={{
              flex: isMobile ? '1' : '2',
              borderRadius: '16px',
              maxHeight: isMobile ? 'none' : '80vh',
              overflow: 'auto',
            }}
          >
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={() => setSelectedArticle(null)}>
                ← Back to Articles
              </Button>
              <Button
                type="primary"
                icon={<Volume2 size={18} />}
                onClick={() => {
                  const text = contentRef.current?.innerText || '';
                  ttsService.speak(text);
                }}
                style={{ borderRadius: '8px' }}
              >
                Read Aloud
              </Button>
            </div>

            <Title level={2} style={{ marginBottom: '8px' }}>
              {selectedArticle.title}
            </Title>
            
            <Space style={{ marginBottom: '24px' }}>
              <Text type="secondary">Category: {selectedArticle.category}</Text>
              <Text type="secondary">• Difficulty: {selectedArticle.difficulty}</Text>
            </Space>

            <div
              ref={contentRef}
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                userSelect: 'text',
              }}
              dangerouslySetInnerHTML={{ __html: selectedArticle.htmlContent }}
            />
          </Card>

          {/* AI Analysis Panel */}
          <Card
            style={{
              flex: '1',
              borderRadius: '16px',
              maxHeight: isMobile ? 'none' : '80vh',
              overflow: 'auto',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={24} />
              <Title level={4} style={{ margin: 0, color: 'white' }}>
                AI Analysis
              </Title>
            </div>

            {!aiAnalysis ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Paragraph style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>
                  Get instant AI-powered analysis of this article including vocabulary insights, main ideas, and IELTS relevance.
                </Paragraph>
                <Button
                  size="large"
                  onClick={analyzeArticle}
                  loading={isAnalyzing}
                  style={{
                    borderRadius: '12px',
                    fontWeight: '600',
                  }}
                >
                  Analyze Article
                </Button>
              </div>
            ) : (
              <div style={{ color: 'white' }}>
                <div
                  style={{
                    whiteSpace: 'pre-line',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  {aiAnalysis}
                </div>
                <Button
                  onClick={() => setAiAnalysis('')}
                  style={{ marginTop: '16px', borderRadius: '8px' }}
                >
                  Clear Analysis
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 1000,
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            padding: '8px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <Button
            size="small"
            icon={<Sparkles size={16} />}
            onClick={handleTranslateDefine}
            loading={isAnalyzing}
            style={{ borderRadius: '8px' }}
          >
            Define
          </Button>
          <Button
            size="small"
            icon={<Plus size={16} />}
            onClick={handleAddToVocabulary}
            type="primary"
            style={{ borderRadius: '8px' }}
          >
            Add to Vocab
          </Button>
          <Button
            size="small"
            icon={<Volume2 size={16} />}
            onClick={handleSpeak}
            style={{ borderRadius: '8px' }}
          >
            Speak
          </Button>
        </div>
      )}
    </div>
  );
};

export default SmartArticlePage;
