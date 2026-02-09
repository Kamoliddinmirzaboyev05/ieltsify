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
  Drawer,
  Divider,
} from 'antd';
import { 
  CheckCircle2,
  Zap,
  Globe,
  Sparkles,
  ShieldCheck,
  PlayCircle,
  Monitor,
  Target,
  MessageSquare,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { DotPattern } from '../components/DotPattern';


const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const menuItems = [
    { title: 'Features', href: '#features' },
    { title: 'Pricing', href: '#pricing' },
    { title: 'About', href: '#about' },
  ];

  return (
    <>
      {/* Fixed DotPattern Background for entire page */}
      <DotPattern
        dotSize={2}
        gap={20}
        baseColor="#10b981"
        glowColor="#22d3ee"
        proximity={150}
        glowIntensity={1.2}
        waveSpeed={0.3}
      />

      <Layout style={{ backgroundColor: 'transparent', minHeight: '100vh', color: '#ffffff', position: 'relative', zIndex: 1 }}>
        
        {/* Floating Centered Header */}
        <div style={{ 
          position: 'fixed', 
          top: '24px', 
          left: 0, 
          right: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          zIndex: 1000,
          padding: '0 20px'
        }}>
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ 
              width: '100%',
              maxWidth: '1200px',
              height: '64px',
              backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.8)' : 'rgba(10, 10, 10, 0.5)', 
              backdropFilter: 'blur(12px)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0 24px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: scrolled ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logohead.png" alt="IELTSIFY Logo" style={{ height: '32px' }} />
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {menuItems.map(item => (
              <a 
                key={item.title} 
                href={item.href} 
                style={{ 
                  color: '#e2e8f0', 
                  fontWeight: 600, 
                  fontSize: '15px',
                  transition: 'color 0.2s'
                }}
                className="hover:text-primary"
              >
                {item.title}
              </a>
            ))}
            <Space size={12} style={{ marginLeft: '12px' }}>
              <Link to="/login">
                <Button type="text" style={{ color: '#e2e8f0', fontWeight: 600 }}>Login</Button>
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
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            className="mobile-nav-toggle"
            type="text" 
            icon={<MenuIcon size={24} />} 
            onClick={() => setMobileMenuOpen(true)}
            style={{ display: 'none' }}
          />
        </motion.header>
      </div>

      <Drawer
        title={null}
        placement="right"
        closable={false}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
        bodyStyle={{ padding: '40px 24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <Button type="text" icon={<X size={24} />} onClick={() => setMobileMenuOpen(false)} />
        </div>
        <Space direction="vertical" size={32} style={{ width: '100%' }}>
          {menuItems.map(item => (
            <a 
              key={item.title} 
              href={item.href} 
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#1e293b', fontSize: '20px', fontWeight: 700, display: 'block' }}
            >
              {item.title}
            </a>
          ))}
          <Divider style={{ margin: '12px 0' }} />
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
            <Button block size="large" style={{ height: '54px', borderRadius: '12px', fontWeight: 600 }}>Log in</Button>
          </Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
            <Button block type="primary" size="large" className="gradient-btn" style={{ height: '54px', borderRadius: '12px', fontWeight: 800 }}>Get Started</Button>
          </Link>
        </Space>
      </Drawer>

      <Content>
        {/* Section 1: Hero */}
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          padding: '160px 5vw 100px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
          }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ maxWidth: '800px', zIndex: 1 }}
            >
              <motion.div variants={itemVariants}>
                <Tag color="success" style={{
                  padding: '4px 16px',
                  borderRadius: '100px',
                  marginBottom: '24px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <Sparkles size={14} style={{ marginRight: '6px' }} /> AI-POWERED PREPARATION
                </Tag>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Title style={{
                  color: '#ffffff',
                  fontSize: 'clamp(40px, 8vw, 76px)',
                  lineHeight: 1.1,
                  fontWeight: 900,
                  marginBottom: '24px',
                  letterSpacing: '-2px',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                }}>
                  Achieve your dream <br /> <span style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>IELTS score</span> with AI
                </Title>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Paragraph style={{
                  color: '#e2e8f0',
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  maxWidth: '600px',
                  margin: '0 auto 40px',
                  lineHeight: 1.6,
                  textShadow: '0 1px 10px rgba(0,0,0,0.3)'
                }}>
                  IELTSIFY combines advanced artificial intelligence with official Cambridge material to help you master all four IELTS modules faster than ever before.
                </Paragraph>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Space size={20} wrap style={{ justifyContent: 'center' }}>
                  <Link to="/register">
                    <Button 
                      size="large" 
                      type="primary" 
                      style={{ 
                        borderRadius: '16px', 
                        height: '60px', 
                      padding: '0 40px', 
                      fontSize: '18px', 
                      fontWeight: 700 
                    }}
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Button 
                  size="large" 
                  icon={<PlayCircle size={20} />}
                  style={{ 
                    borderRadius: '16px', 
                    height: '60px', 
                    padding: '0 32px', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    border: '2px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Watch Demo
                </Button>
              </Space>
            </motion.div>
            
            {/* Trusted By / Stats */}
            <motion.div 
              variants={itemVariants}
              style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
                Trusted by 50,000+ students worldwide
              </Text>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '32px', color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
                <Space size={12}><Globe size={20} />Global Reach</Space>
                <Space size={12}><ShieldCheck size={20} />Certified Content</Space>
                <Space size={12}><Zap size={20} />Instant Results</Space>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

        {/* Section 2: Features */}
        <div style={{ padding: '100px 5vw', backgroundColor: 'rgba(10, 10, 10, 0.5)', backdropFilter: 'blur(10px)' }} id="features">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ color: '#ffffff', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800 }}>
              Everything you need to <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>succeed</span>
            </Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Powerful tools designed to help you prepare smarter and faster for your IELTS examination.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {[
              { icon: <Monitor size={32} />, title: "Full Simulation", desc: "Experience the real IELTS interface and timing to build confidence." },
              { icon: <Zap size={32} />, title: "Instant Feedback", desc: "Get AI-generated scores and detailed corrections in seconds." },
              { icon: <Target size={32} />, title: "Personalized Path", desc: "AI identifies your weak areas and creates a custom study plan." },
              { icon: <MessageSquare size={32} />, title: "Speaking Practice", desc: "Practice with an AI examiner that listens and gives band scores." },
              { icon: <Globe size={32} />, title: "Expert Insights", desc: "Access official Cambridge material curated by IELTS experts." },
              { icon: <ShieldCheck size={32} />, title: "Band 8+ Targeted", desc: "Proven strategies and vocabulary to help you reach the top scores." }
            ].map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card 
                    bordered={false}
                    style={{ 
                      height: '100%', 
                      padding: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px'
                    }}
                  >
                    <div style={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '24px',
                      color: '#10b981'
                    }}>
                      {feature.icon}
                    </div>
                    <Title level={4} style={{ color: '#ffffff', marginBottom: '16px', fontWeight: 700 }}>{feature.title}</Title>
                    <Text style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6 }}>{feature.desc}</Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section 3: Pricing Redesign */}
        <div style={{ padding: '100px 5vw', backgroundColor: 'rgba(10, 10, 10, 0.5)', backdropFilter: 'blur(10px)' }} id="pricing">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ color: '#ffffff', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800 }}>Simple, transparent pricing</Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Start for free, upgrade when you're ready to master the test.
            </Paragraph>
          </div>

          <Row gutter={[40, 40]} justify="center">
            {[
              { name: 'Basic Weekly', price: '9,900', stats: '25 attempts', popular: false },
              { name: 'Monthly Pro', price: '29,900', stats: '100 attempts', popular: true }
            ].map((p, i) => (
              <Col xs={24} md={10} key={i}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ height: '100%' }}
                >
                  <div style={{ 
                    padding: '48px 40px', 
                    borderRadius: '24px', 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: p.popular ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    height: '100%',
                    boxShadow: p.popular ? '0 20px 40px rgba(16, 185, 129, 0.2)' : '0 10px 30px rgba(0,0,0,0.1)'
                  }}>
                    {p.popular && (
                      <Tag color="#10b981" style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', borderRadius: '100px', padding: '4px 16px', fontWeight: 700, border: 'none' }}>
                        MOST POPULAR
                      </Tag>
                    )}
                    <Title level={4} style={{ color: '#ffffff', marginBottom: '8px', fontSize: '24px' }}>{p.name}</Title>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', margin: '32px 0' }}>
                      <span style={{ fontSize: '48px', fontWeight: 800, color: '#ffffff' }}>{p.price}</span>
                      <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 600 }}>UZS</span>
                    </div>
                    <Space direction="vertical" style={{ width: '100%', marginBottom: '40px', textAlign: 'left' }} size={20}>
                      {[p.stats, 'All IELTS modules', 'AI feedback & scoring', 'Daily progress tracking'].map((text, idx) => (
                        <Space key={idx} size={12}>
                          <CheckCircle2 size={20} color={p.popular ? '#10b981' : '#22c55e'} />
                          <Text style={{ color: '#e2e8f0', fontSize: '15px' }}>{text}</Text>
                        </Space>
                      ))}
                    </Space>
                    <Button 
                      block 
                      size="large" 
                      className={p.popular ? 'gradient-btn' : ''}
                      type={p.popular ? 'primary' : 'default'}
                      style={{ 
                        borderRadius: '14px', 
                        height: '60px', 
                        fontWeight: 700,
                        fontSize: '17px',
                        border: p.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                        color: p.popular ? 'white' : '#ffffff',
                        backgroundColor: p.popular ? undefined : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      {/* Footer overhaul */}
      <Footer style={{ 
        backgroundColor: 'rgba(10, 10, 10, 0.8)', 
        backdropFilter: 'blur(10px)',
        padding: '100px 5vw 40px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[64, 64]}>
            <Col xs={24} lg={10} style={{ textAlign: 'inherit' }} className="mobile-center">
              <img src="/logohead.png" alt="IELTSIFY Logo" style={{ height: '40px', marginBottom: '32px' }} />
              <Paragraph style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '400px', lineHeight: 1.6 }}>
                The next generation of IELTS preparation. Achieving your target score has never been this scientific.
              </Paragraph>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Title level={5} style={{ color: '#ffffff', marginBottom: '24px', fontWeight: 700 }}>Platform</Title>
              <Space direction="vertical" size={16}>
                {['Listening', 'Reading', 'Writing', 'Speaking'].map(item => (
                  <Text key={item} style={{ color: '#94a3b8', cursor: 'pointer' }} className="hover:text-primary transition-colors">{item}</Text>
                ))}
              </Space>
            </Col>
            <Col xs={12} sm={6} lg={4}>
              <Title level={5} style={{ color: '#ffffff', marginBottom: '24px', fontWeight: 700 }}>Company</Title>
              <Space direction="vertical" size={16}>
                {['About Us', 'Pricing', 'Blog', 'Contact'].map(item => (
                  <Text key={item} style={{ color: '#94a3b8', cursor: 'pointer' }} className="hover:text-primary transition-colors">{item}</Text>
                ))}
              </Space>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Title level={5} style={{ color: '#ffffff', marginBottom: '24px', fontWeight: 700 }}>Contact</Title>
              <Text style={{ color: '#94a3b8', display: 'block', marginBottom: '16px' }}>support@ieltsify.ai</Text>
              <Space size={16}>
                {/* Social icons could go here */}
              </Space>
            </Col>
          </Row>
          <div style={{ 
            marginTop: '80px', 
            paddingTop: '40px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <Text style={{ color: '#64748b' }}>© {new Date().getFullYear()} IELTSIFY AI. All rights reserved.</Text>
            <Space size={32}>
              <Text style={{ color: '#64748b', cursor: 'pointer' }} className="hover:text-primary transition-colors">Privacy Policy</Text>
              <Text style={{ color: '#64748b', cursor: 'pointer' }} className="hover:text-primary transition-colors">Terms of Use</Text>
            </Space>
          </div>
        </div>
      </Footer>
    </Layout>
    </>
  );
};

export default LandingPage;
