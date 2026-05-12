import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Typography, Modal, Image, message, Card, Tabs, Statistic, Row, Col, Input } from 'antd';
import { CheckCircle, XCircle, Eye, CreditCard, User, Search, Filter, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { monetizationService } from '../services/monetizationService';

const { Title, Text, Paragraph } = Typography;

const AdminMonetizationPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*, user_coins(balance)')
      .order('created_at', { ascending: false });

    if (error) {
      message.error('Requests load error: ' + error.message);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const { data: pendingData } = await supabase.from('payment_requests').select('id', { count: 'exact' }).eq('status', 'pending');
    const { data: approvedData } = await supabase.from('payment_requests').select('amount').eq('status', 'approved');
    
    const revenue = approvedData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    
    setStats({
      pending: pendingData?.length || 0,
      approved: approvedData?.length || 0,
      totalRevenue: revenue
    });
  };

  const handleApprove = async (request: any) => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Admin not found');

      await monetizationService.approvePayment(request.id, user.id);
      message.success('To\'lov tasdiqlandi!');
      setIsModalOpen(false);
      loadRequests();
      loadStats();
    } catch (error: any) {
      message.error('Tasdiqlashda xatolik: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (request: any) => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from('payment_requests')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      message.success('To\'lov bekor qilindi');
      setIsModalOpen(false);
      loadRequests();
      loadStats();
    } catch (error: any) {
      message.error('Xatolik: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      title: 'Foydalanuvchi',
      key: 'user',
      render: (record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.user_id.substring(0, 8)}...</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Balans: {Array.isArray(record.user_coins) ? record.user_coins[0]?.balance : record.user_coins?.balance || 0} coin
          </Text>
        </Space>
      )
    },
    {
      title: 'Turi',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, record: any) => (
        <Tag color={type === 'subscription' ? 'purple' : 'gold'}>
          {type === 'subscription' ? `Obuna: ${record.plan_type}` : `Coins: ${record.coin_amount}`}
        </Tag>
      )
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>{amount.toLocaleString()} so'm</Text>
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString('uz-UZ')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = { pending: 'warning', approved: 'success', rejected: 'error' };
        return <Tag color={(colors as any)[status]}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: any) => (
        <Button 
          icon={<Eye size={16} />} 
          onClick={() => {
            setSelectedRequest(record);
            setIsModalOpen(true);
          }}
        >
          Ko'rish
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Monetizatsiya Boshqaruvi</Title>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card style={{ borderRadius: '16px' }} variant="borderless">
            <Statistic 
              title="Kutilayotgan to'lovlar" 
              value={stats.pending} 
              prefix={<Clock size={20} style={{ marginRight: '8px', color: '#faad14' }} />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: '16px' }} variant="borderless">
            <Statistic 
              title="Tasdiqlangan to'lovlar" 
              value={stats.approved} 
              prefix={<CheckCircle size={20} style={{ marginRight: '8px', color: '#52c41a' }} />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: '16px' }} variant="borderless">
            <Statistic 
              title="Umumiy tushum" 
              value={stats.totalRevenue} 
              suffix="so'm"
              prefix={<CreditCard size={20} style={{ marginRight: '8px', color: '#1890ff' }} />} 
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '16px' }} title="To'lov so'rovlari" variant="borderless">
        <Table 
          columns={columns} 
          dataSource={requests} 
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title="To'lov ma'lumotlari"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={600}
        footer={selectedRequest?.status === 'pending' ? [
          <Button key="reject" danger icon={<XCircle size={16} />} onClick={() => handleReject(selectedRequest)} loading={processing}>
            Rad etish
          </Button>,
          <Button key="approve" type="primary" icon={<CheckCircle size={16} />} onClick={() => handleApprove(selectedRequest)} loading={processing}>
            Tasdiqlash
          </Button>
        ] : null}
      >
        {selectedRequest && (
          <div style={{ padding: '16px 0' }}>
            <Row gutter={24}>
              <Col span={12}>
                <Text type="secondary">Foydalanuvchi ID:</Text>
                <Paragraph strong>{selectedRequest.user_id}</Paragraph>
                
                <Text type="secondary">To'lov turi:</Text>
                <Paragraph strong>{selectedRequest.type === 'subscription' ? 'Obuna' : 'Coinlar'}</Paragraph>
                
                <Text type="secondary">Miqdor:</Text>
                <Paragraph strong>{selectedRequest.amount.toLocaleString()} so'm</Paragraph>
              </Col>
              <Col span={12}>
                <Text type="secondary">Chek tasviri:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Image
                    src={selectedRequest.receipt_url}
                    alt="Payment Receipt"
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid #d9d9d9' }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminMonetizationPage;
