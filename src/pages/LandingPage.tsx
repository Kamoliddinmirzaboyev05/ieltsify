import React from "react";
import { Link } from "react-router-dom";
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
  Zap,
} from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="landing">
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
        <div className="landing-hero-content">
          <div className="landing-badge">
            <Zap size={14} />
            <span>AI-powered IELTS Preparation</span>
          </div>
          <h1 className="landing-title">
            Achieve your IELTS goal <br />
            with a <span className="landing-title-accent">clear plan</span>
          </h1>
          <p className="landing-desc">
            IELTSify gives you more than just tests — an individual study plan,
            AI analysis, and real-time progress tracking.
          </p>
          <div className="landing-hero-btns">
            <Link to="/register" className="landing-btn-primary">
              Start Free <ArrowRight size={16} />
            </Link>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat">
              <strong>4 Skills</strong>
              <span>Reading, Listening, Writing, Speaking</span>
            </div>
            <div className="landing-stat">
              <strong>AI Analysis</strong>
              <span>Band score + feedback</span>
            </div>
            <div className="landing-stat">
              <strong>Individual Plan</strong>
              <span>Updated weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="landing-section">
        <h2 className="landing-section-title">What will you achieve on the platform?</h2>
        <p className="landing-section-desc">
          From registration to exam day — every step is planned
        </p>
        <div className="landing-features-grid">
          {[
            {
              icon: <Target size={22} />,
              title: "Goal Setting",
              desc: "Enter your current level and target score — the platform creates a plan tailored to you",
            },
            {
              icon: <Calendar size={22} />,
              title: "Daily Plan",
              desc: "Know exactly what to do each day — exercises tailored to your schedule",
            },
            {
              icon: <BookOpen size={22} />,
              title: "Reading Exercises",
              desc: "IELTS-format passages, question types, and time management",
            },
            {
              icon: <Headphones size={22} />,
              title: "Listening Tests",
              desc: "Real exam environment with audio — single listening mode",
            },
            {
              icon: <PenLine size={22} />,
              title: "Writing AI Analysis",
              desc: "Write an essay — AI shows your band score, errors, and improvement tips",
            },
            {
              icon: <Mic size={22} />,
              title: "Speaking AI",
              desc: "Speak — AI evaluates pronunciation, grammar, and fluency",
            },
            {
              icon: <Brain size={22} />,
              title: "Weak Areas",
              desc: "The platform identifies your weak points and focuses more on them",
            },
            {
              icon: <TrendingUp size={22} />,
              title: "Progress Tracking",
              desc: "View your weekly and monthly results through interactive charts",
            },
          ].map((f, i) => (
            <div key={i} className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section landing-section-alt">
        <h2 className="landing-section-title">How does it work?</h2>
        <div className="landing-steps">
          {[
            {
              num: "1",
              title: "Sign up",
              desc: "Enter your current level, target score, and exam date",
            },
            {
              num: "2",
              title: "Get an individual plan",
              desc: "The platform creates a weekly study plan tailored to you",
            },
            {
              num: "3",
              title: "Practice every day",
              desc: "Reading, Listening, Writing, Speaking — daily specific tasks",
            },
            {
              num: "4",
              title: "See your results",
              desc: "AI analysis, progress tracking, and updated recommendations",
            },
          ].map((s, i) => (
            <div key={i} className="landing-step">
              <div className="landing-step-num">{s.num}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="landing-section">
        <h2 className="landing-section-title">Simple & transparent pricing</h2>
        <p className="landing-section-desc">
          Start free, upgrade to premium when you need more
        </p>
        <div className="landing-pricing-grid">
          <div className="landing-price-card">
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
                <CheckCircle size={14} /> 1 Writing AI per week
              </li>
              <li>
                <CheckCircle size={14} /> Vocabulary exercises
              </li>
            </ul>
            <Link to="/register" className="landing-price-btn">
              Start Free
            </Link>
          </div>
          <div className="landing-price-card featured">
            <div className="landing-price-badge">Recommended</div>
            <h3>IELTSify Monthly</h3>
            <div className="landing-price">
              29,900 <span>UZS / month</span>
            </div>
            <ul>
              <li>
                <CheckCircle size={14} /> Unlimited Reading & Listening
              </li>
              <li>
                <CheckCircle size={14} /> 20 Writing AI analyses
              </li>
              <li>
                <CheckCircle size={14} /> 20 Speaking AI analyses
              </li>
              <li>
                <CheckCircle size={14} /> Individual weekly plan
              </li>
              <li>
                <CheckCircle size={14} /> Full Mock Exam
              </li>
              <li>
                <CheckCircle size={14} /> 70 bonus coins
              </li>
            </ul>
            <Link to="/register" className="landing-price-btn primary">
              Buy Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Start your IELTS journey today</h2>
        <p>Thousands of students are already preparing with IELTSify</p>
        <Link to="/register" className="landing-btn-primary">
          Register Free <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <strong>IELTSify</strong>
            <p>AI-powered IELTS preparation platform</p>
          </div>
          <div className="landing-footer-links">
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