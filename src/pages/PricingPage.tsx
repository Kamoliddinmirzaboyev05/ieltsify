import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Gem, Crown, ShieldCheck, Flame, Upload, X, Copy, CheckCircle2, CreditCard } from 'lucide-react';
import { Modal, Button, Upload as AntUpload, message, Typography, Input, Space } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { monetizationService } from '../services/monetizationService';
import { supabase } from '../lib/supabase';

const { Title, Text, Paragraph } = Typography;

interface Plan {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  period: string;
  description: string;
  features: string[];
  type: 'subscription' | 'coins';
  coinAmount?: number;
  isPopular?: boolean;
}

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'coins'>('subscriptions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    loadReferralCode();
  }, []);

  const loadReferralCode = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const code = await monetizationService.getReferralCode(user.id);
      setReferralCode(code);
    }
  };

  const CARD_NUMBER = "8600 0000 0000 0000"; // Real card number should be here
  const CARD_HOLDER = "IELTSIFY PLATFORM";

  const plans: Plan[] = [
    // Subscriptions
    {
      id: 'weekly', 
      name: 'Haftalik Pro',
      price: 7999,
      priceFormatted: '7,999',
      period: 'hafta',
      description: 'Imtihondan oldin qisqa muddatli intensiv tayyorgarlik uchun.',
      features: ['7 kun davomida cheksiz Reading/Listening', 'Barcha AI tahlillari uchun foydalanish', 'Kunlik streak va yutuqlar'],
      type: 'subscription',
      isPopular: false
    },
    {
      id: 'monthly',
      name: 'Oylik Pro',
      price: 24999,
      priceFormatted: '24,999',
      period: 'oy',
      description: 'Eng mashhur va samarali tanlov.',
      features: ['30 kun davomida cheksiz foydalanish', 'Kuchsiz tomonlarni AI tahlili', '100 bonus coin (AI baholash uchun)', 'Ustuvor qo\'llab-quvvatlash'],
      type: 'subscription',
      isPopular: true
    },
    {
      id: '3months',
      name: '3 Oylik Pro',
      price: 59999,
      priceFormatted: '59,999',
      period: '3 oy',
      description: 'Uzoq muddatli va barqaror tayyorgarlik uchun.',
      features: ['90 kun davomida cheksiz foydalanish', 'Barcha kurslar va materiallar', '300 bonus coin', 'Shaxsiy o\'quv rejasi'],
      type: 'subscription',
      isPopular: false
    },
    {
      id: 'yearly',
      name: 'Yillik Pro',
      price: 199999,
      priceFormatted: '199,999',
      period: 'yil',
      description: 'Eng katta chegirma va to\'liq imkoniyatlar.',
      features: ['365 kun davomida cheksiz foydalanish', 'Barcha yangi funksiyalar', '1000 bonus coin', 'VIP maqomi'],
      type: 'subscription',
      isPopular: false
    },
    // Coins
    {
      id: 'coins_50',
      name: 'Starter Pack',
      price: 9999,
      priceFormatted: '9,999',
      period: 'bir martalik',
      description: '50 Coin ~ 5-7 ta Writing/Speaking tahlili uchun.',
      features: ['50 Coin', 'Muddatsiz foydalanish'],
      type: 'coins',
      coinAmount: 50
    },
    {
      id: 'coins_150',
      name: 'Intensive Pack',
      price: 19999,
      priceFormatted: '19,999',
      period: 'bir martalik',
      description: '150 Coin + 50 BONUS. Eng yaxshi qiymat.',
      features: ['150 + 50 BONUS Coin', 'Tezkor tahlillar'],
      type: 'coins',
      coinAmount: 200,
      isPopular: true
    },
    {
      id: 'coins_300',
      name: 'Ultimate Pack',
      price: 34999,
      priceFormatted: '34,999',
      period: 'bir martalik',
      description: '300 Coin. Ko\'p foydalanuvchilar uchun.',
      features: ['300 Coin', 'Cheksiz tahlillar'],
      type: 'coins',
      coinAmount: 300
    }
  ];

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCopyCard = () => {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''));
    message.success('Karta raqami nusxalandi!');
  };

  const handleSubmitPayment = async () => {
    if (fileList.length === 0) {
      message.error('Iltimos, to\'lov chekini yuklang!');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Foydalanuvchi aniqlanmadi');

      // 1. Upload file
      const file = fileList[0].originFileObj as File;
      const receiptUrl = await monetizationService.uploadReceipt(file, user.id);

      // 2. Submit request
      await monetizationService.submitPaymentRequest({
        user_id: user.id,
        amount: selectedPlan!.price,
        type: selectedPlan!.type,
        plan_type: selectedPlan!.type === 'subscription' ? selectedPlan!.id : undefined,
        coin_amount: selectedPlan!.type === 'coins' ? selectedPlan!.coinAmount : undefined,
        receipt_url: receiptUrl
      });

      message.success('To\'lov so\'rovi yuborildi! Adminlar tez orada ko\'rib chiqishadi.');
      setIsModalOpen(false);
      setFileList([]);
    } catch (error: any) {
      console.error('Payment error:', error);
      message.error('Xatolik yuz berdi: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent pb-20">
      {/* Header */}
      <div className="text-center pt-10 pb-12 px-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
          Kelajagingiz uchun sarmoya qiling
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          O'zingizga mos tarifni tanlang yoki AI tahlillari uchun coin sotib oling.
        </p>
        
        {/* Toggle */}
        <div className="mt-8 inline-flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'subscriptions'
                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Obunalar
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'coins'
                ? 'bg-yellow-400 text-yellow-900 shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Coin Do'koni
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Referral Section */}
        <div className="mb-16 bg-blue-600 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <img src="/coin.png" alt="coin" style={{ width: 120, height: 120 }} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" />
                Do'stlaringizni taklif qiling va Coin yuting!
              </h2>
              <p className="text-blue-50 mb-6">
                Har bir taklif qilingan do'stingiz uchun 50 coin, do'stingiz uchun esa 100 coin bonus. 
                Ular obuna sotib olganda esa 800 coingacha qo'shimcha mukofot oling!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 flex items-center justify-between gap-4 flex-1">
                  <code className="text-lg font-mono font-bold">{referralCode || 'YUKLANMOQDA...'}</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${referralCode}`);
                      message.success('Havola nusxalandi!');
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Copy size={20} />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    const text = `IELTSify - IELTSga tayyorlanish uchun eng zo'r platforma! Ro'yxatdan o'ting va 100 coin bonus oling: ${window.location.origin}/register?ref=${referralCode}`;
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/register?ref=' + referralCode)}&text=${encodeURIComponent(text)}`);
                  }}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                >
                  Do'stga ulashish
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                <div className="text-2xl font-bold">+100</div>
                <div className="text-xs text-blue-100">Yangi foydalanuvchi</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
                <div className="text-2xl font-bold">+50</div>
                <div className="text-xs text-blue-100">Sizga (Taklif uchun)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center col-span-2">
                <div className="text-lg font-bold">+150 ~ +800</div>
                <div className="text-xs text-blue-100">Ular Pro obuna olganda</div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'subscriptions' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.filter(p => p.type === 'subscription').map(plan => (
              <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-xl p-6 border ${plan.isPopular ? 'border-blue-500 shadow-md scale-105 z-10' : 'border-slate-200 shadow-sm'} flex flex-col relative`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    Eng mashhur
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{plan.priceFormatted}</span>
                    <span className="ml-1 text-sm text-slate-500">so'm / {plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-blue-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-400">{f}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                    plan.isPopular 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200'
                  }`}
                >
                  Tanlash
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.filter(p => p.type === 'coins').map(plan => (
              <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-xl p-6 border ${plan.isPopular ? 'border-yellow-400 shadow-md' : 'border-slate-100'} flex flex-col group`}>
                <div className="flex justify-center my-4 group-hover:scale-110 transition-transform">
                  <img src="/coin.png" alt="coin" style={{ width: 48, height: 48 }} />
                </div>
                <div className="text-center mb-6">
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{plan.coinAmount} Coins</div>
                  <div className="text-lg font-bold text-blue-600 mt-2">{plan.priceFormatted} so'm</div>
                </div>
                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full py-2.5 bg-yellow-400 text-yellow-900 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-all"
                >
                  Sotib olish
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
        centered
        className="payment-modal"
      >
        <div className="p-2">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} />
            </div>
            <Title level={3} style={{ margin: 0 }}>To'lovni amalga oshiring</Title>
            <Text type="secondary">Tanlangan tarif: <span className="font-bold text-slate-900">{selectedPlan?.name}</span></Text>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl mb-6 border border-slate-100 dark:border-slate-700">
            <div className="mb-4">
              <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">To'lov miqdori:</Text>
              <div className="text-2xl font-black text-blue-600">{selectedPlan?.priceFormatted} so'm</div>
            </div>
            
            <div className="mb-4">
              <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Karta raqami:</Text>
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 mt-1">
                <span className="font-mono text-lg font-bold">{CARD_NUMBER}</span>
                <Button type="text" icon={<Copy size={18} />} onClick={handleCopyCard} />
              </div>
            </div>

            <div>
              <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Karta egasi:</Text>
              <div className="font-bold mt-1">{CARD_HOLDER}</div>
            </div>
          </div>

          <div className="mb-6">
            <Text className="block mb-2 font-bold">To'lov chekini yuklang (Rasm yoki PDF):</Text>
            <AntUpload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              className="w-full"
            >
              <Button icon={<Upload size={18} />} block className="h-12 border-dashed border-2 rounded-lg">
                Chekni tanlash
              </Button>
            </AntUpload>
          </div>

          <div className="space-y-3">
            <Button 
              type="primary" 
              size="large" 
              block 
              className="h-12 bg-blue-600 hover:bg-blue-700 border-none font-bold rounded-lg"
              onClick={handleSubmitPayment}
              loading={uploading}
            >
              To'lovni tasdiqlash
            </Button>
            <Button 
              type="text" 
              block 
              onClick={() => setIsModalOpen(false)}
            >
              Bekor qilish
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3">
            <ShieldCheck size={20} className="text-blue-500 shrink-0" />
            <Text className="text-xs text-blue-700 dark:text-blue-400">
              Sizning to'lovingiz adminlarimiz tomonidan 1-12 soat ichida tekshiriladi va tarifingiz avtomatik faollashadi.
            </Text>
          </div>
        </div>
      </Modal>

      {/* Trust Badges */}
      <div className="mt-20 border-t border-slate-200 dark:border-slate-700/50 pt-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Xavfsiz To'lov</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tezkor Faollashtirish</span>
          </div>
          <div className="flex flex-col items-center">
            <Gem className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Rasmiy AI Model</span>
          </div>
          <div className="flex flex-col items-center">
            <Crown className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Premium Yordam</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
