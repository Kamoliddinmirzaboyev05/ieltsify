-- 1. user_coins table
CREATE TABLE user_coins (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  balance INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. coin_transactions table
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'signup_bonus', 'test_fee', 'purchase', 'referral_reward', 'daily_login'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. user_subscriptions table
CREATE TABLE user_subscriptions (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  plan_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', '3months', 'yearly'
  status VARCHAR(20) DEFAULT 'active' NOT NULL, -- 'active', 'expired', 'cancelled'
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  admin_approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. referral_links table
CREATE TABLE referral_links (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. referral_history table
CREATE TABLE referral_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  referred_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  reward_amount INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. payment_requests table
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'subscription' | 'coins'
  plan_type VARCHAR(50), -- for subscriptions
  coin_amount INTEGER, -- for coin packages
  receipt_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- user_coins: User can see their own balance
CREATE POLICY "Users can view own balance" ON user_coins
  FOR SELECT USING (auth.uid() = user_id);

-- coin_transactions: User can see their own transactions
CREATE POLICY "Users can view own transactions" ON coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- user_subscriptions: User can see their own subscription
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- referral_links: Everyone can see referral links (to verify codes), but only own can be managed
CREATE POLICY "Users can view all referral links" ON referral_links
  FOR SELECT USING (true);
CREATE POLICY "Users can manage own referral link" ON referral_links
  FOR ALL USING (auth.uid() = user_id);

-- referral_history: Referrer can see their rewards
CREATE POLICY "Referrers can view own referral history" ON referral_history
  FOR SELECT USING (auth.uid() = referrer_id);

-- payment_requests: User can see and create own requests
CREATE POLICY "Users can view own payment requests" ON payment_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payment requests" ON payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin Policies
-- ... existing policies ...

-- RPC Functions for atomic operations
CREATE OR REPLACE FUNCTION deduct_coins_and_log(
  p_user_id UUID,
  p_amount INTEGER,
  p_type VARCHAR,
  p_description TEXT
) RETURNS VOID AS $$
BEGIN
  -- Update balance
  UPDATE user_coins
  SET balance = balance - p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Log transaction
  INSERT INTO coin_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_amount, p_type, p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION add_coins_and_log(
  p_user_id UUID,
  p_amount INTEGER,
  p_type VARCHAR,
  p_description TEXT
) RETURNS VOID AS $$
BEGIN
  -- Update balance or create if not exists
  INSERT INTO user_coins (user_id, balance, updated_at)
  VALUES (p_user_id, p_amount, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    balance = user_coins.balance + p_amount,
    updated_at = NOW();

  -- Log transaction
  INSERT INTO coin_transactions (user_id, amount, type, description)
  VALUES (p_user_id, p_amount, p_type, p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
