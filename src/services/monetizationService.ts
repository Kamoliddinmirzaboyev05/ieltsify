import { supabase } from '../lib/supabase';

export interface UserCoins {
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface UserSubscription {
  user_id: string;
  plan_type: 'basic' | 'standard' | 'premium';
  status: 'active' | 'expired' | 'cancelled';
  starts_at: string;
  expires_at: string;
}

export interface PaymentRequest {
  id?: string;
  user_id: string;
  amount: number;
  currency?: string;
  provider?: 'click' | 'payme' | 'uzum' | 'admin';
  status: 'pending' | 'completed' | 'failed' | 'approved' | 'rejected';
  type: 'subscription' | 'coins';
  plan_type?: string;
  coin_amount?: number;
  receipt_url: string;
  external_tx_id?: string;
}

export const monetizationService = {
  // Get current coin balance
  getBalance: async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('user_coins')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
    return data?.balance || 0;
  },

  // Get active subscription
  getSubscription: async (userId: string): Promise<UserSubscription | null> => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }
      return data as UserSubscription | null;
    } catch (err) {
      console.error('Subscription service error:', err);
      return null;
    }
  },

  // Submit payment request
  submitPaymentRequest: async (request: Omit<PaymentRequest, 'status' | 'id'>) => {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        ...request,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload receipt image
  uploadReceipt: async (file: File, userId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('payments')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Get referral code
  getReferralCode: async (userId: string): Promise<string> => {
    const { data, error } = await supabase
      .from('referral_links')
      .select('code')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching referral code:', error);
      return '';
    }
    return data?.code || '';
  },

  // Deduct coins via Edge Function
  deductCoins: async (userId: string, amount: number, type: string, description: string) => {
    const { data, error } = await supabase.functions.invoke('monetization-handler', {
      body: {
        action: 'deduct_coins',
        userId,
        amount,
        type,
        description
      }
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);
    return data;
  },

  // Onboard user
  onboardUser: async (userId: string, referrerCode?: string) => {
    try {
      // Basic onboarding (coins + profile) is handled by DB trigger
      // Here we only handle referral if provided
      if (referrerCode) {
        const { data: refLink } = await supabase
          .from('referral_links')
          .select('user_id')
          .eq('code', referrerCode)
          .single();

        if (refLink && refLink.user_id !== userId) {
          await supabase.from('referral_history').insert({
            referrer_id: refLink.user_id,
            referee_id: userId,
          });
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Onboarding Error:', error);
      // Return success anyway as DB trigger might have worked
      return { success: true };
    }
  },

  // Approve payment
  approvePayment: async (requestId: string, adminId: string) => {
    const { data, error } = await supabase.functions.invoke('monetization-handler', {
      body: {
        action: 'approve_payment',
        requestId,
        adminId
      }
    });

    if (error) throw error;
    return data;
  }
};
