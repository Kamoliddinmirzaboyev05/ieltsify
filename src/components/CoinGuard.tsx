import React, { useState } from 'react';
import { Modal, Button, Typography, Space, message } from 'antd';
import { Zap } from 'lucide-react';
import { monetizationService } from '../services/monetizationService';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface CoinGuardProps {
  cost: number;
  type: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactElement;
  isSubscriptionBenefit?: boolean;
}

const CoinGuard: React.FC<CoinGuardProps> = ({ 
  cost, 
  type, 
  description, 
  onConfirm, 
  children,
  isSubscriptionBenefit = false
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Foydalanuvchi aniqlanmadi');

      // Check for subscription if it's a benefit
      if (isSubscriptionBenefit) {
        const sub = await monetizationService.getSubscription(user.id);
        if (sub) {
          onConfirm();
          return;
        }
      }

      // Check balance
      const balance = await monetizationService.getBalance(user.id);
      if (balance < cost) {
        Modal.warning({
          title: 'Coinlar yetarli emas',
          content: (
            <div>
              <Paragraph>Ushbu testni boshlash uchun sizda kamida {cost} coin bo'lishi kerak.</Paragraph>
              <Paragraph>Hozirgi balansingiz: <strong>{balance} coin</strong></Paragraph>
              <Button 
                type="primary" 
                icon={<Zap size={16} />} 
                onClick={() => {
                  Modal.destroyAll();
                  navigate('/dashboard/pricing');
                }}
              >
                Coin sotib olish
              </Button>
            </div>
          ),
          okText: 'Yopish',
        });
        return;
      }

      setVisible(true);
    } catch (error: any) {
      message.error('Xatolik: ' + error.message);
    }
  };

  const confirmDeduction = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      await monetizationService.deductCoins(user.id, cost, type, description);
      message.success('Coinlar muvaffaqiyatli ayirildi');
      setVisible(false);
      onConfirm();
    } catch (error: any) {
      message.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<any>, { onClick: handleStart })}
      
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            background: '#fef9c3', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid #fde047'
          }}>
            <img src="/coin.png" alt="coin" style={{ width: 32, height: 32 }} />
          </div>
          
          <Title level={4}>Testni boshlash</Title>
          <Paragraph>
            Ushbu testni boshlash uchun balansingizdan <strong>{cost} coin</strong> ayiriladi.
          </Paragraph>
          
          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text type="secondary">Xizmat turi:</Text>
              <Text font-bold>{description}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Narxi:</Text>
              <Text strong style={{ color: '#eab308' }}>{cost} Coin</Text>
            </div>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button 
              type="primary" 
              size="large" 
              block 
              loading={loading}
              onClick={confirmDeduction}
              style={{ height: '48px', borderRadius: '12px', fontWeight: '600' }}
            >
              Tasdiqlash va boshlash
            </Button>
            <Button 
              type="text" 
              block 
              onClick={() => setVisible(false)}
            >
              Bekor qilish
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default CoinGuard;
