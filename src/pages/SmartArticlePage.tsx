import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Space, Modal, message, Empty, Grid } from 'antd';
import { BookOpen, Plus, Volume2, Sparkles } from 'lucide-react';
import { articleManager, vocabularyManager } from '../services/dataManager';
import { ttsService } from '../services/ttsService';
import { sendMessageToGemini } from '../services/aiService';
import type { Article } from '../types';
import { useTheme } from '../contexts/ThemeContext';

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
  const { isDark } = useTheme();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [translationData, setTranslationData] = useState<{
    word: string;
    definition: string;
    translation: string;
    examples: string[];
    level: string;
  } | null>(null);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
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
    if (!translationData) return;

    // Check if word already exists
    const existing = vocabularyManager.search(translationData.word);
    if (existing.length > 0) {
      message.info('Bu so\'z allaqachon vocabulary da mavjud!');
      return;
    }

    vocabularyManager.add({
      word: translationData.word,
      definition: translationData.definition,
      level: translationData.level as any,
      masteryLevel: 0,
      examples: translationData.examples,
    });

    message.success(`"${translationData.word}" vocabulary ga qo'shildi!`);
    setShowTranslationModal(false);
    setContextMenu(null);
  };

  const handleTranslateDefine = async () => {
    if (!contextMenu) return;

    setIsAnalyzing(true);
    
    try {
      const prompt = `Analyze this English word/phrase and provide information in JSON format:

Word/Phrase: "${contextMenu.selectedText}"

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "word": "${contextMenu.selectedText}",
  "definition": "Clear English definition (1-2 sentences)",
  "translation": "O'zbek tilidagi tarjima (Uzbek translation)",
  "examples": ["Example sentence 1", "Example sentence 2"],
  "level": "A1/A2/B1/B2/C1/C2"
}

IMPORTANT: Return ONLY the JSON object, nothing else.`;

      const response = await sendMessageToGemini(prompt);
      const cleanJson = response.replace(/```json|```/gi, '').trim();
      const data = JSON.parse(cleanJson);
      
      setTranslationData(data);
      setShowTranslationModal(true);
      setContextMenu(null);
    } catch (error) {
      console.error('Translation error:', error);
      message.error('Tarjima olishda xatolik yuz berdi');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = () => {
    if (!contextMenu) return;
    ttsService.speak(contextMenu.selectedText);
    setContextMenu(null);
  };

  const analyzeArticle = async () => {
    if (!selectedArticle) return;

    setIsAnalyzing(true);
    
    try {
      const prompt = `Analyze this article for IELTS preparation:

Title: ${selectedArticle.title}
Content: ${selectedArticle.htmlContent.replace(/<[^>]*>/g, '').substring(0, 1000)}

Provide analysis in this format:

**Difficulty Level:** [difficulty]

**Key Vocabulary:**
- List 5-7 important words/phrases

**Main Ideas:**
1. [Main idea 1]
2. [Main idea 2]
3. [Main idea 3]

**IELTS Relevance:**
[How this relates to IELTS]

**Recommended Practice:**
- [Tip 1]
- [Tip 2]
- [Tip 3]`;

      const analysis = await sendMessageToGemini(prompt);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      message.error('Tahlil qilishda xatolik yuz berdi');
    } finally {
      setIsAnalyzing(false);
    }
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
            background: isDark ? '#1e293b' : 'white',
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
            Tarjima
          </Button>
          <Button
            size="small"
            icon={<Volume2 size={16} />}
            onClick={handleSpeak}
            style={{ borderRadius: '8px' }}
          >
            Tinglash
          </Button>
        </div>
      )}

      {/* Translation Modal */}
      <Modal
        open={showTranslationModal}
        onCancel={() => setShowTranslationModal(false)}
        footer={null}
        width={600}
        style={{ top: 40 }}
      >
        {translationData && (
          <div style={{ padding: '20px 0' }}>
            <Title level={3} style={{ marginBottom: '24px', color: '#3b82f6' }}>
              {translationData.word}
            </Title>

            <Space direction="vertical" style={{ width: '100%' }} size={20}>
              {/* Level Badge */}
              <div>
                <Text strong style={{ fontSize: '12px', color: '#64748b' }}>DARAJA</Text>
                <div style={{ marginTop: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: '#eff6ff',
                    color: '#1e40af',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    {translationData.level}
                  </span>
                </div>
              </div>

              {/* Definition */}
              <div>
                <Text strong style={{ fontSize: '12px', color: '#64748b' }}>INGLIZCHA TA'RIF</Text>
                <Paragraph style={{ 
                  marginTop: '8px', 
                  fontSize: '15px', 
                  lineHeight: '1.6',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                }}>
                  {translationData.definition}
                </Paragraph>
              </div>

              {/* Translation */}
              <div>
                <Text strong style={{ fontSize: '12px', color: '#64748b' }}>O'ZBEKCHA TARJIMA</Text>
                <Paragraph style={{ 
                  marginTop: '8px', 
                  fontSize: '15px', 
                  lineHeight: '1.6',
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4',
                  padding: '12px',
                  borderRadius: '8px',
                  color: '#15803d',
                  fontWeight: '500',
                }}>
                  {translationData.translation}
                </Paragraph>
              </div>

              {/* Examples */}
              <div>
                <Text strong style={{ fontSize: '12px', color: '#64748b' }}>MISOLLAR</Text>
                <div style={{ marginTop: '8px' }}>
                  {translationData.examples.map((example, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fafafa',
                        borderLeft: '3px solid #3b82f6',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontStyle: 'italic',
                      }}
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<Plus size={18} />}
                  onClick={handleAddToVocabulary}
                  block
                  style={{ borderRadius: '8px', fontWeight: '600' }}
                >
                  Vocabulary ga qo'shish
                </Button>
                <Button
                  size="large"
                  icon={<Volume2 size={18} />}
                  onClick={() => ttsService.speak(translationData.word)}
                  style={{ borderRadius: '8px' }}
                >
                  Tinglash
                </Button>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SmartArticlePage;
