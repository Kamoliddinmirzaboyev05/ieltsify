import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Checkbox, 
  Space, 
  Card, 
  Avatar, 
  App,
  Spin,
  Radio,
  theme
} from 'antd';
import { 
  Send, 
  User, 
  Bot, 
  CheckCircle2, 
  Target, 
  Calendar, 
  Clock, 
  BrainCircuit,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../services/authService';
import { supabase } from '../lib/supabase';

const { Title, Text, Paragraph } = Typography;

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string | React.ReactNode;
}

interface OnboardingData {
  current_band: number | null;
  target_band: number | null;
  exam_date: string | null;
  weak_skills: string[];
  daily_study_time: number | null;
  previous_experience: boolean | null;
  previous_score: number | null;
  purpose: string | null;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    current_band: null,
    target_band: null,
    exam_date: null,
    weak_skills: [],
    daily_study_time: null,
    previous_experience: null,
    previous_score: null,
    purpose: null,
  });

  const handleNextStep = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        target_score: data.target_band || 0,
        target_date: data.exam_date || undefined,
        role: 'student',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      message.error('Ma\'lumotlarni saqlashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const OptionCard: React.FC<{ 
    title: string; 
    description: string; 
    selected: boolean; 
    onClick: () => void 
  }> = ({ title, description, selected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        padding: '20px 24px',
        borderRadius: '20px',
        border: selected ? `2px solid ${token.colorText}` : `1px solid ${token.colorBorderSecondary}`,
        background: selected ? token.colorText : token.colorBgContainer,
        color: selected ? token.colorBgContainer : token.colorText,
        cursor: 'pointer',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: selected ? '0 10px 20px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease'
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '13px', opacity: selected ? 0.7 : 0.5 }}>{description}</div>
      </div>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: selected ? `2px solid ${token.colorBgContainer}` : `2px solid ${token.colorBorderSecondary}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: selected ? '#fbbf24' : 'transparent'
      }}>
        {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: token.colorText }} />}
      </div>
    </motion.div>
  );

  const ScoreGrid: React.FC<{ 
    value: number | null; 
    onChange: (val: number) => void 
  }> = ({ value, onChange }) => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(6, 1fr)', 
      gap: '10px', 
      margin: '24px 0' 
    }}>
      {Array.from({ length: 11 }, (_, i) => 4 + i * 0.5).map((score) => (
        <motion.div
          key={score}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(score)}
          style={{
            height: '54px',
            borderRadius: '14px',
            border: value === score ? `2px solid ${token.colorText}` : `1px solid ${token.colorBorderSecondary}`,
            background: value === score ? token.colorText : token.colorBgContainer,
            color: value === score ? token.colorBgContainer : token.colorText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease'
          }}
        >
          {score.toFixed(1)}
        </motion.div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ textAlign: 'center', maxWidth: '450px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ marginBottom: '32px' }}
            >
              <img src="/beemascot.png" alt="Mascot" style={{ height: '120px', marginBottom: '24px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Ajoyib tanlov</div>
              <Title level={1} style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2, color: token.colorText }}>
                Siz hozirda muhim qadamni bosib o'tdingiz.
              </Title>
              <Text style={{ fontSize: '15px', color: token.colorTextDescription, lineHeight: 1.6 }}>
                O'zbekistonda 700 dan ortiq talabalar IELTSify bilan o'z maqsadlariga erishishdi. Siz ham ular qatoridasiz.
              </Text>
            </motion.div>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleNextStep}
              style={{ 
                height: '56px', 
                borderRadius: '28px', 
                padding: '0 40px', 
                background: token.colorBgContainer, 
                color: token.colorText, 
                border: `1px solid ${token.colorBorder}`,
                fontWeight: 700,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              Davom etish <ArrowRight size={18} />
            </Button>
          </div>
        );
      case 1:
        return (
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <img src="/beemascot.png" alt="Mascot" style={{ height: '64px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ 
                background: token.colorBgContainer, 
                padding: '16px 20px', 
                borderRadius: '18px 18px 18px 4px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
                flex: 1
              }}>
                Tanishganimdan xursandman! Oldin IELTS topshirganmisiz?
              </div>
            </div>
            
            <OptionCard 
              title="Ha, ballim bor" 
              description="Hozirgi natijamni bilaman" 
              selected={data.previous_experience === true}
              onClick={() => setData({ ...data, previous_experience: true })}
            />
            <OptionCard 
              title="Yo'q, lekin o'qiyapman" 
              description="Hozir tayyorgarlik ko'ryapman" 
              selected={data.previous_experience === false && data.current_band !== null}
              onClick={() => setData({ ...data, previous_experience: false, current_band: 0 })}
            />
            <OptionCard 
              title="Hech qachon topshirmaganman" 
              description="Noldan boshlayapman" 
              selected={data.previous_experience === false && data.current_band === null}
              onClick={() => setData({ ...data, previous_experience: false, current_band: null })}
            />

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNextStep}
                disabled={data.previous_experience === null}
                style={{ 
                  height: '56px', 
                  borderRadius: '28px', 
                  padding: '0 40px', 
                  background: data.previous_experience !== null ? token.colorBgContainer : token.colorBgContainerDisabled, 
                  color: data.previous_experience !== null ? token.colorText : token.colorTextDisabled, 
                  border: `1px solid ${token.colorBorder}`,
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                Davom etish <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <img src="/beemascot.png" alt="Mascot" style={{ height: '64px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ 
                background: token.colorBgContainer, 
                padding: '16px 20px', 
                borderRadius: '18px 18px 18px 4px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
                flex: 1
              }}>
                Hozirgi darajangiz qanday deb o'ylaysiz? Taxminiy bo'lsa ham bo'ladi.
              </div>
            </div>

            <ScoreGrid 
              value={data.current_band} 
              onChange={(val) => setData({ ...data, current_band: val })} 
            />

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Button type="link" style={{ color: token.colorTextDescription, fontWeight: 600 }} onClick={() => {
                setData({ ...data, current_band: 0 });
                handleNextStep();
              }}>
                Bilmayman
              </Button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNextStep}
                disabled={data.current_band === null}
                style={{ 
                  height: '56px', 
                  borderRadius: '28px', 
                  padding: '0 40px', 
                  background: data.current_band !== null ? token.colorBgContainer : token.colorBgContainerDisabled, 
                  color: data.current_band !== null ? token.colorText : token.colorTextDisabled, 
                  border: `1px solid ${token.colorBorder}`,
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                Davom etish <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <img src="/beemascot.png" alt="Mascot" style={{ height: '64px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ 
                background: token.colorBgContainer, 
                padding: '16px 20px', 
                borderRadius: '18px 18px 18px 4px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
                flex: 1
              }}>
                Qanday ballga erishmoqchisiz?
              </div>
            </div>

            <ScoreGrid 
              value={data.target_band} 
              onChange={(val) => setData({ ...data, target_band: val })} 
            />

            {data.target_band && data.current_band !== null && (
              <div style={{ textAlign: 'center', marginBottom: '32px', color: token.colorTextDescription, fontSize: '14px' }}>
                Katta sakrash — <span style={{ color: '#fbbf24', fontWeight: 700 }}>+{(data.target_band - (data.current_band || 0)).toFixed(1)} band</span>. Biz imtihon sanasigacha nima real ekanligi haqida halol bo'lamiz.
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNextStep}
                disabled={!data.target_band}
                style={{ 
                  height: '56px', 
                  borderRadius: '28px', 
                  padding: '0 40px', 
                  background: data.target_band ? token.colorBgContainer : token.colorBgContainerDisabled, 
                  color: data.target_band ? token.colorText : token.colorTextDisabled, 
                  border: `1px solid ${token.colorBorder}`,
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                Davom etish <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <img src="/beemascot.png" alt="Mascot" style={{ height: '64px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ 
                background: token.colorBgContainer, 
                padding: '16px 20px', 
                borderRadius: '18px 18px 18px 4px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
                flex: 1
              }}>
                Imtihon topshirish sanasini belgiladingizmi?
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <DatePicker 
                style={{ width: '100%', height: '56px', borderRadius: '16px', border: `1px solid ${token.colorBorderSecondary}`, background: token.colorBgContainer, color: token.colorText }} 
                size="large" 
                placeholder="Imtihon sanasini tanlang"
                onChange={(date) => setData({ ...data, exam_date: date ? date.format('YYYY-MM-DD') : null })}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNextStep}
                disabled={!data.exam_date}
                style={{ 
                  height: '56px', 
                  borderRadius: '28px', 
                  padding: '0 40px', 
                  background: data.exam_date ? token.colorBgContainer : token.colorBgContainerDisabled, 
                  color: data.exam_date ? token.colorText : token.colorTextDisabled, 
                  border: `1px solid ${token.colorBorder}`,
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                Davom etish <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <img src="/beemascot.png" alt="Mascot" style={{ height: '64px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ 
                background: token.colorBgContainer, 
                padding: '16px 20px', 
                borderRadius: '18px 18px 18px 4px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
                flex: 1
              }}>
                Qaysi ko'nikmalarda ko'proq yordam kerak?
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {['Listening', 'Reading', 'Writing', 'Speaking'].map(skill => (
                <OptionCard 
                  key={skill}
                  title={skill} 
                  description={`${skill} bo'yicha tayyorgarlik`} 
                  selected={data.weak_skills.includes(skill)}
                  onClick={() => {
                    const newSkills = data.weak_skills.includes(skill)
                      ? data.weak_skills.filter(s => s !== skill)
                      : [...data.weak_skills, skill];
                    setData({ ...data, weak_skills: newSkills });
                  }}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNextStep}
                disabled={data.weak_skills.length === 0}
                style={{ 
                  height: '56px', 
                  borderRadius: '28px', 
                  padding: '0 40px', 
                  background: data.weak_skills.length > 0 ? token.colorBgContainer : token.colorBgContainerDisabled, 
                  color: data.weak_skills.length > 0 ? token.colorText : token.colorTextDisabled, 
                  border: `1px solid ${token.colorBorder}`,
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                Davom etish <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <img src="/beemascot.png" alt="Mascot" style={{ height: '64px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ 
                background: token.colorBgContainer, 
                padding: '16px 20px', 
                borderRadius: '18px 18px 18px 4px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
                flex: 1
              }}>
                Har kuni qancha vaqt ajrata olasiz?
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { label: '30 daqiqa', val: 30, desc: 'Tezkor o\'rganish' },
                { label: '1 soat', val: 60, desc: 'Standart reja' },
                { label: '2 soat', val: 120, desc: 'Intensiv tayyorgarlik' },
                { label: '3+ soat', val: 180, desc: 'Maksimal natija' }
              ].map(item => (
                <OptionCard 
                  key={item.val}
                  title={item.label} 
                  description={item.desc} 
                  selected={data.daily_study_time === item.val}
                  onClick={() => setData({ ...data, daily_study_time: item.val })}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNextStep}
                disabled={!data.daily_study_time}
                style={{ 
                  height: '56px', 
                  borderRadius: '28px', 
                  padding: '0 40px', 
                  background: data.daily_study_time ? token.colorBgContainer : token.colorBgContainerDisabled, 
                  color: data.daily_study_time ? token.colorText : token.colorTextDisabled, 
                  border: `1px solid ${token.colorBorder}`,
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                Davom etish <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        );
      case 7:
        return (
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <img src="/beemascot.png" alt="Mascot" style={{ height: '64px' }} 
                   onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3062/3062331.png' }} />
              <div style={{ 
                background: token.colorBgContainer, 
                padding: '16px 20px', 
                borderRadius: '18px 18px 18px 4px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
                flex: 1
              }}>
                IELTS topshirishdan asosiy maqsadingiz nima?
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <Input 
                placeholder="Masalan: Universitetga kirish" 
                size="large"
                style={{ height: '56px', borderRadius: '16px', border: `1px solid ${token.colorBorderSecondary}`, background: token.colorBgContainer, color: token.colorText }}
                onChange={(e) => setData({ ...data, purpose: e.target.value })}
                onPressEnter={() => data.purpose && handleNextStep()}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleNextStep}
                disabled={!data.purpose}
                loading={loading}
                style={{ 
                  height: '56px', 
                  borderRadius: '28px', 
                  padding: '0 40px', 
                  background: data.purpose ? token.colorText : token.colorBgContainerDisabled, 
                  color: data.purpose ? token.colorBgContainer : token.colorTextDisabled, 
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                Tugatish <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: token.colorBgBase,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Header */}
      <div style={{ 
        height: '80px', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div 
          onClick={handlePrevStep}
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: token.colorBgContainer, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            visibility: step > 0 ? 'visible' : 'hidden',
            border: `1px solid ${token.colorBorderSecondary}`,
            color: token.colorText
          }}
        >
          <ChevronLeft size={20} />
        </div>

        {step > 0 && (
          <div style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: '200px',
            height: '6px',
            background: token.colorBorderSecondary,
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 7) * 100}%` }}
              style={{ height: '100%', background: token.colorText }}
            />
          </div>
        )}

        {step === 0 && (
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logohead.png" alt="IELTSIFY" style={{ height: '24px' }} />
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px', color: token.colorText }}>ieltsify</span>
          </div>
        )}
        
        <div style={{ width: '40px' }} />
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
