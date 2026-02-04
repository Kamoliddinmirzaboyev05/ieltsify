import React from 'react';
import { 
  Typography, 
  Button, 
  Row, 
  Col, 
  Space, 
  Card,
  Layout, 
  Tag,
} from 'antd';
import { 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic2, 
  CheckCircle2,
  Zap,
  ArrowRight,
  Globe,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <Layout style={{ backgroundColor: 'transparent', minHeight: '100vh', color: '#fff' }}>
      <AnimatedBackground />
      
      {/* Header */}
      <Header style={{ 
        position: 'fixed', 
        zIndex: 1000, 
        width: '100%', 
        backgroundColor: 'rgba(9, 9, 11, 0.5)', 
        backdropFilter: 'blur(20px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 5vw',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        height: '72px'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="IELTSIFY Logo" style={{ height: '36px', marginRight: '40px' }} />
          </Link>
          <Space size={32} className="mobile-hide">
            {['Home', 'Pricing', 'About', 'Contact'].map((item) => (
              <Text key={item} style={{ color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', fontWeight: 500 }} className="hover:text-white transition-colors">
                {item}
              </Text>
            ))}
          </Space>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <Space size={16}>
            <Link to="/login">
              <Button type="text" style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Login</Button>
            </Link>
            <Link to="/register">
              <Button 
                className="gradient-btn"
                type="primary"
                style={{ 
                  borderRadius: '12px', 
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: 700
                }}
              >
                Get Started
              </Button>
            </Link>
          </Space>
        </motion.div>
      </Header>

      <Content>
        {/* Section 1: Hero */}
        <div style={{ 
          padding: '160px 5vw 100px', 
          textAlign: 'center',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '1000px' }}
          >
            <motion.div variants={itemVariants}>
              <Tag color="rgba(139, 92, 246, 0.1)" style={{ color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '4px 16px', borderRadius: '100px', marginBottom: '24px', fontWeight: 600 }}>
                <Space size={8}><Sparkles size={14} /> AI-Powered Excellence</Space>
              </Tag>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Title style={{ 
                color: 'white', 
                fontSize: 'clamp(40px, 8vw, 84px)', 
                fontWeight: 800, 
                lineHeight: 1.1,
                marginBottom: '24px',
                letterSpacing: '-2px'
              }} className="gradient-text">
                Achieve your dream <br /> IELTS score with AI
              </Title>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Paragraph style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: 'clamp(18px, 2vw, 22px)', 
                lineHeight: 1.6,
                maxWidth: '700px',
                margin: '0 auto 48px',
                fontWeight: 500
              }}>
                IELTSIFY combines advanced artificial intelligence with official Cambridge criteria to give you the most accurate practice experience in the world.
              </Paragraph>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Space size={20} wrap style={{ justifyContent: 'center' }}>
                <Link to="/register">
                  <Button 
                    size="large" 
                    className="gradient-btn"
                    type="primary"
                    style={{ 
                      borderRadius: '16px', 
                      height: '64px', 
                      padding: '0 40px', 
                      fontSize: '18px', 
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    Start Free Trial <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                  </Button>
                </Link>
                <Button 
                  size="large" 
                  style={{ 
                    borderRadius: '16px', 
                    height: '64px', 
                    padding: '0 40px', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                >
                  View Demo
                </Button>
              </Space>
            </motion.div>
            
            {/* Trusted By / Stats */}
            <motion.div 
              variants={itemVariants}
              style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
                Trusted by 50,000+ students worldwide
              </Text>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '32px', opacity: 0.5, flexWrap: 'wrap' }}>
                <Space size={12}><Globe size={20} />Global Reach</Space>
                <Space size={12}><ShieldCheck size={20} />Certified Content</Space>
                <Space size={12}><Zap size={20} />Instant Results</Space>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Section 2: Features Overhaul */}
        <div style={{ padding: '100px 5vw' }}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <Title level={2} style={{ color: 'white', fontSize: '48px', fontWeight: 800, letterSpacing: '-1px' }}>Master all four skills</Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to succeed in your IELTS exam, powered by real-time AI feedback and comprehensive practice materials.
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {[
              { icon: <Headphones size={32} />, title: 'Listening', desc: 'Immersive audio sessions with real-time transcript tracking and instant scoring.', color: '#06b6d4' },
              { icon: <BookOpen size={32} />, title: 'Reading', desc: 'Complex passages with interactive question types and deep vocabulary analysis.', color: '#8b5cf6' },
              { icon: <PenTool size={32} />, title: 'Writing', desc: 'AI examiner grades your essays based on coherence, grammar, and task response.', color: '#ec4899' },
              { icon: <Mic2 size={32} />, title: 'Speaking', desc: 'Voice recognition AI analyzes your fluency, pronunciation, and vocabulary.', color: '#f59e0b' }
            ].map((f, i) => (
              <Col xs={24} md={12} lg={6} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    className="glass-card"
                    bordered={false}
                    style={{ height: '100%' }}
                    bodyStyle={{ padding: '40px' }}
                  >
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '16px', 
                      backgroundColor: `${f.color}15`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '32px',
                      color: f.color
                    }}>
                      {f.icon}
                    </div>
                    <Title level={3} style={{ color: 'white', marginBottom: '16px', fontWeight: 700 }}>{f.title}</Title>
                    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '16px', lineHeight: 1.6 }}>
                      {f.desc}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section 3: Pricing Redesign */}
        <div style={{ padding: '100px 5vw' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card"
            style={{ 
              maxWidth: '1000px', 
              margin: '0 auto', 
              padding: '80px 40px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              textAlign: 'center'
            }}
          >
            <Title level={2} style={{ color: 'white', fontSize: '42px', fontWeight: 800 }}>Simple, transparent pricing</Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '18px', marginBottom: '60px' }}>
              Start for free, upgrade when you're ready to master the test.
            </Paragraph>

            <Row gutter={[40, 40]} justify="center">
              {[
                { name: 'Basic Weekly', price: '9,900', stats: '25 attempts', popular: false },
                { name: 'Monthly Pro', price: '29,900', stats: '100 attempts', popular: true }
              ].map((p, i) => (
                <Col xs={24} md={10} key={i}>
                  <div style={{ 
                    padding: '40px', 
                    borderRadius: '24px', 
                    background: p.popular ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' : 'rgba(255, 255, 255, 0.03)',
                    border: p.popular ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative'
                  }}>
                    {p.popular && (
                      <Tag color="#8b5cf6" style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', borderRadius: '100px', padding: '4px 16px', fontWeight: 700 }}>
                        MOST POPULAR
                      </Tag>
                    )}
                    <Title level={4} style={{ color: 'white', marginBottom: '8px' }}>{p.name}</Title>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', margin: '24px 0' }}>
                      <span style={{ fontSize: '48px', fontWeight: 800, color: 'white' }}>{p.price}</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '16px' }}>UZS</span>
                    </div>
                    <Space direction="vertical" style={{ width: '100%', marginBottom: '32px', textAlign: 'left' }} size={16}>
                      {[p.stats, 'All IELTS modules', 'AI feedback & scoring', 'Daily progress tracking'].map((text, idx) => (
                        <Space key={idx} size={12}>
                          <CheckCircle2 size={18} color={p.popular ? '#8b5cf6' : '#22c55e'} />
                          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{text}</Text>
                        </Space>
                      ))}
                    </Space>
                    <Button 
                      block 
                      size="large" 
                      className={p.popular ? 'gradient-btn' : ''}
                      type={p.popular ? 'primary' : 'default'}
                      style={{ 
                        borderRadius: '12px', 
                        height: '56px', 
                        fontWeight: 700,
                        backgroundColor: p.popular ? '' : 'transparent',
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </Content>

      {/* Footer overhaul */}
      <Footer style={{ 
        backgroundColor: 'rgba(9, 9, 11, 0.8)', 
        padding: '100px 5vw 40px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[64, 64]}>
            <Col xs={24} lg={10}>
              <img src="/logo.png" alt="IELTSIFY Logo" style={{ height: '40px', marginBottom: '32px' }} />
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '18px', maxWidth: '400px', lineHeight: 1.6 }}>
                The next generation of IELTS preparation. Achieving your target score has never been this scientific.
              </Paragraph>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Title level={5} style={{ color: 'white', marginBottom: '24px', fontWeight: 700 }}>Platform</Title>
              <Space direction="vertical" size={16}>
                {['Listening', 'Reading', 'Writing', 'Speaking'].map(item => (
                  <Text key={item} style={{ color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }}>{item}</Text>
                ))}
              </Space>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Title level={5} style={{ color: 'white', marginBottom: '24px', fontWeight: 700 }}>Company</Title>
              <Space direction="vertical" size={16}>
                {['About Us', 'Pricing', 'Blog', 'Contact'].map(item => (
                  <Text key={item} style={{ color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }}>{item}</Text>
                ))}
              </Space>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Title level={5} style={{ color: 'white', marginBottom: '24px', fontWeight: 700 }}>Contact</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginBottom: '16px' }}>support@ieltsify.ai</Text>
              <Space size={16}>
                {/* Social icons could go here */}
              </Space>
            </Col>
          </Row>
          <div style={{ 
            marginTop: '80px', 
            paddingTop: '40px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.3)' }}>© {new Date().getFullYear()} IELTSIFY AI. All rights reserved.</Text>
            <Space size={32}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}>Privacy Policy</Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}>Terms of Use</Text>
            </Space>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
