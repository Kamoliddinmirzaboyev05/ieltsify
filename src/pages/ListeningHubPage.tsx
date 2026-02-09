import React, { useState, useEffect } from 'react';
import { Card, Typography, Select, Empty, Input, Button, Space, Tag, Grid } from 'antd';
import { Headphones, Play, FileText } from 'lucide-react';
import { listeningManager, notesManager } from '../services/dataManager';
import type { ListeningResource } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const ListeningHubPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const [resources, setResources] = useState<ListeningResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<ListeningResource | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    if (selectedResource) {
      const existingNotes = notesManager.getByResource(selectedResource.id);
      if (existingNotes.length > 0) {
        setNotes(existingNotes[0].content);
      }
    }
  }, [selectedResource]);

  const loadResources = () => {
    setResources(listeningManager.getAll());
  };

  const handleSaveNotes = () => {
    if (selectedResource && notes.trim()) {
      notesManager.add({
        resourceId: selectedResource.id,
        resourceType: 'listening',
        content: notes,
      });
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const filteredResources = category === 'all'
    ? resources
    : resources.filter(r => r.category === category);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      academic: 'blue',
      general: 'green',
      podcast: 'orange',
      lecture: 'purple',
    };
    return colors[cat] || 'default';
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
            <Headphones size={isMobile ? 28 : 32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Listening Hub
          </Title>
          <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
            Practice with categorized listening resources
          </Text>
        </div>
        <Select
          value={category}
          onChange={setCategory}
          style={{ width: isMobile ? '100%' : '200px' }}
          size="large"
        >
          <Select.Option value="all">All Categories</Select.Option>
          <Select.Option value="academic">Academic</Select.Option>
          <Select.Option value="general">General</Select.Option>
          <Select.Option value="podcast">Podcast</Select.Option>
          <Select.Option value="lecture">Lecture</Select.Option>
        </Select>
      </div>

      {!selectedResource ? (
        <div>
          {filteredResources.length === 0 ? (
            <Empty
              description="No listening resources available. Add resources in Resource Manager."
              style={{ marginTop: '60px' }}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  hoverable
                  onClick={() => setSelectedResource(resource)}
                  style={{ borderRadius: '16px', cursor: 'pointer' }}
                  cover={
                    <div style={{
                      height: '180px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px 16px 0 0',
                    }}>
                      <Play size={48} color="white" />
                    </div>
                  }
                >
                  <Title level={4} style={{ marginBottom: '8px' }} ellipsis>
                    {resource.title}
                  </Title>
                  <Space style={{ marginBottom: '12px' }}>
                    <Tag color={getCategoryColor(resource.category)}>
                      {resource.category}
                    </Tag>
                    <Tag>{resource.difficulty}</Tag>
                    {resource.duration && <Tag>{resource.duration}</Tag>}
                  </Space>
                  <Button type="primary" block style={{ borderRadius: '8px' }}>
                    Watch & Practice
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Button
            onClick={() => setSelectedResource(null)}
            style={{ marginBottom: '16px', borderRadius: '8px' }}
          >
            ← Back to Resources
          </Button>

          <div style={{ display: 'flex', gap: '24px', flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Video Player */}
            <Card style={{ flex: '2', borderRadius: '16px' }}>
              <Title level={3} style={{ marginBottom: '16px' }}>
                {selectedResource.title}
              </Title>
              <Space style={{ marginBottom: '16px' }}>
                <Tag color={getCategoryColor(selectedResource.category)}>
                  {selectedResource.category}
                </Tag>
                <Tag>{selectedResource.difficulty}</Tag>
              </Space>

              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '12px',
              }}>
                <iframe
                  src={getYouTubeEmbedUrl(selectedResource.youtubeUrl)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '12px',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>

            {/* Interactive Notes */}
            <Card
              style={{
                flex: '1',
                borderRadius: '16px',
                maxHeight: isMobile ? 'none' : '600px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FileText size={20} />
                <Title level={4} style={{ margin: 0 }}>
                  Interactive Notes
                </Title>
              </div>

              <Paragraph type="secondary" style={{ fontSize: '13px', marginBottom: '16px' }}>
                Take notes while watching. Your notes are automatically saved.
              </Paragraph>

              <TextArea
                rows={isMobile ? 10 : 15}
                placeholder="Start typing your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ marginBottom: '12px' }}
              />

              <Button
                type="primary"
                block
                onClick={handleSaveNotes}
                style={{ borderRadius: '8px' }}
              >
                Save Notes
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningHubPage;
