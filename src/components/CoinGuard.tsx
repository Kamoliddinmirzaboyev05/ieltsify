import React from 'react';
import { message } from 'antd';
import { getAccessToken } from '../services/authService';

interface CoinGuardProps {
  cost: number;
  type: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactElement;
  isSubscriptionBenefit?: boolean;
}

const CoinGuard: React.FC<CoinGuardProps> = ({
  onConfirm,
  children,
}) => {
  const handleStart = () => {
    const token = getAccessToken();
    if (!token) {
      message.error('Iltimos, tizimga kiring');
      return;
    }
    onConfirm();
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, { onClick: handleStart })}
    </>
  );
};

export default CoinGuard;