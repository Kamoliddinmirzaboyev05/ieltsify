import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  animate,
  type Variants,
} from "framer-motion";
import {
  Target,
  BookOpen,
  Headphones,
  PenLine,
  Mic,
  TrendingUp,
  Calendar,
  Brain,
  CheckCircle,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { FaTelegramPlane, FaInstagram } from "react-icons/fa";

/* ---------------- Motion helpers ---------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const viewport = { once: true, amount: 0.2 } as const;

/* Count-up number that animates when scrolled into view */
const CountUp: React.FC<{
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}> = ({ to, prefix = "", suffix = "", duration = 1.4 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(value)}
      {suffix}
    </span>
  );
};

/* ---------------- Data ---------------- */

const FEATURES = [
  {
    icon: <Target size={22} />,
    title: "Goal-Based Planning",
    desc: "Set your current level and target band — IELTSify builds a study plan tailored to exactly where you stand.",
  },
  {
    icon: <Calendar size={22} />,
    title: "Daily Study Plan",
    desc: "No guesswork. Every day you know precisely what to practice, sized to fit your schedule.",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Reading Practice",
    desc: "Authentic IELTS-format passages with every question type and built-in time management.",
  },
  {
    icon: <Headphones size={22} />,
    title: "Listening Tests",
    desc: "True exam conditions with audio played once — just like the real test.",
  },
  {
    icon: <PenLine size={22} />,
    title: "Writing AI Analysis",
    desc: "Submit an essay and instantly receive an estimated band, error breakdown, and concrete improvements.",
  },
  {
    icon: <Mic size={22} />,
    title: "Speaking AI",
    desc: "Speak aloud and get scored on pronunciation, grammar, and fluency in seconds.",
  },
  {
    icon: <Brain size={22} />,
    title: "Weak-Area Detection",
    desc: "The platform pinpoints your weakest skills and quietly shifts your plan to strengthen them.",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Progress Tracking",
    desc: "Follow your weekly and monthly growth through clear, interactive charts.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Create your account",
    desc: "Tell us your current level, target band, and exam date.",
  },
  {
    num: "2",
    title: "Receive your plan",
    desc: "IELTSify generates a weekly study roadmap built around your goal.",
  },
  {
    num: "3",
    title: "Practice every day",
    desc: "Reading, Listening, Writing, and Speaking — focused daily tasks.",
  },
  {
    num: "4",
    title: "Track your results",
    desc: "AI analysis, progress charts, and recommendations that update as you improve.",
  },
];

const STATS = [
  { to: 4, suffix: "", label: "Core skills covered" },
  { to: 100, suffix: "%", label: "Authentic exam format" },
  { to: 24, suffix: "/7", label: "Instant AI feedback" },
];

/* ---------------- Page ---------------- */

const LandingPage: React.FC = () => {
  return (
    <div className="landing">
      {/* Decorative background */}
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-bg-grid" />
        <div className="landing-bg-glow landing-bg-glow-1" />
        <div className="landing-bg-glow landing-bg-glow-2" />
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <img
              src="/logohead.png"
              alt="IELTSify"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span>IELTSify</span>
          </Link>
          <div className="landing-nav-links">
            <a href="#how" className="landing-nav-link landing-nav-link-hide">
              How it works
            </a>
            <a href="#pricing" className="landing-nav-link landing-nav-link-hide">
              Pricing
            </a>
            <Link to="/login" className="landing-nav-link">
              Sign In
            </Link>
            <Link to="/register" className="landing-nav-btn">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <motion.div
          className="landing-hero-content"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className="landing-badge" variants={fadeUp}>
            <Sparkles size={14} />
            <span>AI-Powered IELTS Preparation</span>
          </motion.div>

          <motion.h1 className="landing-title" variants={fadeUp}>
            Master IELTS with a plan
            <br />
            built <span className="landing-title-accent">around you</span>
          </motion.h1>

          <motion.p className="landing-desc" variants={fadeUp}>
            IELTSify is more than a question bank. Get a personalized study plan,
            instant AI band scoring, and progress you can actually see — across
            all four skills.
          </motion.p>

          <motion.div className="landing-hero-btns" variants={fadeUp}>
            <Link to="/register" className="landing-btn-primary">
              Start Free <ArrowRight size={16} />
            </Link>
            <a href="#how" className="landing-btn-ghost">
              See how it works
            </a>
          </motion.div>

          <motion.div className="landing-hero-stats" variants={fadeUp}>
            {STATS.map((s) => (
              <div key={s.label} className="landing-stat">
                <strong>
                  <CountUp to={s.to} suffix={s.suffix} />
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* What you get */}
      <motion.section
        className="landing-section"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.h2 className="landing-section-title" variants={fadeUp}>
          Everything you need to reach your band
        </motion.h2>
        <motion.p className="landing-section-desc" variants={fadeUp}>
          From your first day to exam day — every step is planned for you.
        </motion.p>
        <div className="landing-features-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="landing-feature-card"
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="landing-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How it works */}
      <section id="how" className="landing-section landing-section-alt">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.h2 className="landing-section-title" variants={fadeUp}>
            How it works
          </motion.h2>
          <motion.p className="landing-section-desc" variants={fadeUp}>
            Four simple steps from sign-up to score.
          </motion.p>
          <div className="landing-steps">
            {STEPS.map((s, i) => (
              <motion.div key={i} className="landing-step" variants={fadeUp}>
                <div className="landing-step-num">{s.num}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing preview */}
      <motion.section
        id="pricing"
        className="landing-section"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.h2 className="landing-section-title" variants={fadeUp}>
          Simple, transparent pricing
        </motion.h2>
        <motion.p className="landing-section-desc" variants={fadeUp}>
          Start free. Upgrade to Premium the moment you want more.
        </motion.p>
        <div className="landing-pricing-grid">
          <motion.div className="landing-price-card" variants={fadeUp}>
            <h3>Free</h3>
            <div className="landing-price">
              0 <span>UZS</span>
            </div>
            <ul>
              <li>
                <CheckCircle size={14} /> 1 Reading per day
              </li>
              <li>
                <CheckCircle size={14} /> 1 Listening per day
              </li>
              <li>
                <CheckCircle size={14} /> 1 Writing AI analysis per week
              </li>
              <li>
                <CheckCircle size={14} /> Vocabulary practice
              </li>
            </ul>
            <Link to="/register" className="landing-price-btn">
              Start Free
            </Link>
          </motion.div>

          <motion.div
            className="landing-price-card featured"
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="landing-price-badge">
              <GraduationCap size={11} /> Most Popular
            </div>
            <h3>IELTSify Premium</h3>
            <div className="landing-price">
              29,900 <span>UZS / month</span>
            </div>
            <ul>
              <li>
                <CheckCircle size={14} /> Unlimited Reading &amp; Listening
              </li>
              <li>
                <CheckCircle size={14} /> 20 Writing AI analyses
              </li>
              <li>
                <CheckCircle size={14} /> 20 Speaking AI analyses
              </li>
              <li>
                <CheckCircle size={14} /> Personalized weekly plan
              </li>
              <li>
                <CheckCircle size={14} /> Full Mock Exam
              </li>
              <li>
                <CheckCircle size={14} /> 70 bonus coins
              </li>
            </ul>
            <Link to="/register" className="landing-price-btn primary">
              Get Premium
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="landing-cta"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="landing-cta-inner">
          <h2>Start your IELTS journey today</h2>
          <p>Join the students already preparing smarter with IELTSify.</p>
          <Link to="/register" className="landing-btn-primary">
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <strong>IELTSify</strong>
            <p>AI-powered IELTS preparation platform</p>
            <div className="landing-socials">
              <a
                href="https://t.me/ieltsfyplatform"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IELTSify on Telegram"
                className="landing-social"
              >
                <FaTelegramPlane size={16} />
              </a>
              <a
                href="https://instagram.com/ieltsfyplatform"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IELTSify on Instagram"
                className="landing-social"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>
          <div className="landing-footer-links">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
        <div className="landing-footer-bottom">
          &copy; {new Date().getFullYear()} IELTSify. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
