import React, { useState, useEffect } from 'react';
import { Input, Modal, List, Tag, Empty, Typography } from 'antd';
import { Search, BookOpen, Headphones, Book } from 'lucide-react';
import { globalSearch } from '../services/dataManager';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface GlobalSearchProps {
  visible: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ visible, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const performSearch = async () => {
      if (query.length > 1) {
        const searchResults = await globalSearch(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    };
    performSearch();
  }, [query]);

  const handleResultClick = (result: any) => {
    switch (result.type) {
      case 'vocabulary':
        navigate('/dashboard/vocabulary');
        break;
      case 'article':
        navigate('/dashboard/smart-article');
        break;
      case 'listening':
        navigate('/dashboard/listening');
        break;
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return <Book size={20} color="#3b82f6" />;
      case 'article':
        return <BookOpen size={20} color="#10b981" />;
      case 'listening':
        return <Headphones size={20} color="#f59e0b" />;
      default:
        return <Search size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return 'blue';
      case 'article':
        return 'green';
      case 'listening':
        return 'orange';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={{ top: 100 }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '20px 20px 0 20px' }}>
        <Input
          size="large"
          placeholder="Search across vocabulary, articles, and listening..."
          prefix={<Search size={20} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{ borderRadius: '12px' }}
        />
      </div>

      <div style={{ maxHeight: '400px', overflow: 'auto', padding: '20px' }}>
        {results.length === 0 && query.length > 1 ? (
          <Empty description="No results found" />
        ) : results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Text type="secondary">
              Start typing to search across all your resources
            </Text>
          </div>
        ) : (
          <List
            dataSource={results}
            renderItem={(item) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => handleResultClick(item)}
              >
                <List.Item.Meta
                  avatar={getIcon(item.type)}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{item.title}</span>
                      <Tag color={getTypeColor(item.type)} style={{ fontSize: '10px' }}>
                        {item.type}
                      </Tag>
                    </div>
                  }
                  description={
                    <Text type="secondary" ellipsis style={{ fontSize: '13px' }}>
                      {item.snippet}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #f0f0f0',
        background: '#fafafa',
        borderRadius: '0 0 8px 8px',
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Press ESC to close • {results.length} results
        </Text>
      </div>
    </Modal>
  );
};

export default GlobalSearch;
