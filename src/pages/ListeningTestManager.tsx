import React, { useState } from 'react';
import { Card, Typography, Button, Input, Upload, message, Space, Tag, Modal, Grid } from 'antd';
import { Upload as UploadIcon, Plus, Trash2, Headphones } from 'lucide-react';
import { listeningTestManager } from '../services/dataManager';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ListeningTestManager: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { isDark } = useTheme();
  
  const [title, setTitle] = useState('');
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [tests, setTests] = useState(listeningTestManager.getAll());

  const handleHtmlUpload = (file: File) => {
    setHtmlFile(file);
    message.success('HTML fayl yuklandi!');
    return false;
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    message.success('Rasm yuklandi!');
    return false;
  };

  const handleSubmit = async () => {
    if (!title || !htmlFile) {
      message.error('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    try {
      const htmlContent = await htmlFile.text();
      
      listeningTestManager.add({
        title,
        htmlContent,
        imageUrl: imageUrl || undefined,
      });

      message.success('Listening test qo\'shildi!');
      setTitle('');
      setHtmlFile(null);
      setImageUrl('');
      setTests(listeningTestManager.getAll());
    } catch {
      message.error('HTML faylni o\'qishda xatolik!');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'O\'chirish',
      content: 'Rostdan ham o\'chirmoqchimisiz?',
      onOk: () => {
        listeningTestManager.delete(id);
        setTests(listeningTestManager.getAll());
        message.success('O\'chirildi');
      },
    });
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={1} style={{ margin: 0, fontSize: isMobile ? '24px' : '32px', fontWeight: '800' }}>
          🎧 Listening Test Manager
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
          Listening mock test uchun HTML fayllar yuklang
        </Text>
      </div>

      {/* Upload Form */}
      <Card style={{ borderRadius: '16px', marginBottom: '24px' }}>
        <Title level={3} style={{ marginBottom: '24px' }}>
          <Plus size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Yangi Listening Test
        </Title>

        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <div>
            <Text strong>Sarlavha *</Text>
            <Input
              size="large"
              placeholder="Masalan: IELTS Listening Practice Test 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>HTML Fayl *</Text>
            <Upload
              accept=".html,.htm"
              beforeUpload={handleHtmlUpload}
              maxCount={1}
              fileList={htmlFile ? [{ uid: '-1', name: htmlFile.name, status: 'done' }] : []}
              onRemove={() => setHtmlFile(null)}
              style={{ marginTop: '8px' }}
            >
              <Button icon={<UploadIcon size={18} />} size="large" block>
                HTML fayl yuklash
              </Button>
            </Upload>
          </div>

          <div>
            <Text strong>Rasm (ixtiyoriy)</Text>
            <Upload
              accept="image/*"
              beforeUpload={handleImageUpload}
              maxCount={1}
              showUploadList={false}
              style={{ marginTop: '8px' }}
            >
              <Button icon={<UploadIcon size={18} />} size="large" block>
                Rasm yuklash
              </Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: '12px' }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '120px',
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                  }}
                />
                <Button
                  size="small"
                  danger
                  onClick={() => setImageUrl('')}
                  style={{ marginLeft: '12px' }}
                >
                  O'chirish
                </Button>
              </div>
            )}
          </div>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleSubmit}
            style={{ borderRadius: '12px', fontWeight: '600', marginTop: '8px' }}
          >
            Qo'shish
          </Button>
        </Space>
      </Card>

      {/* Existing Tests */}
      <Card style={{ borderRadius: '16px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Mavjud Testlar ({tests.length})
        </Title>
        {tests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Headphones size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
            <Text type="secondary">Hali testlar yo'q</Text>
          </div>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            {tests.map((test) => (
              <Card
                key={test.id}
                size="small"
                style={{ 
                  borderRadius: '12px', 
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '16px' }}>{test.title}</Text>
                    <div style={{ marginTop: '4px' }}>
                      {test.imageUrl && <Tag>🖼️ Rasm bor</Tag>}
                      <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                        {new Date(test.uploadDate).toLocaleDateString()}
                      </Text>
                    </div>
                    {test.imageUrl && (
                      <div style={{ marginTop: '12px' }}>
                        <img
                          src={test.imageUrl}
                          alt="Test"
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
                    onClick={() => handleDelete(test.id)}
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
  );
};

export default ListeningTestManager;
