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
  Shield,
  Clock,
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
              Kirish
            </Link>
            <Link to="/register" className="landing-nav-btn">
              Boshlash
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <Zap size={14} />
            <span>AI bilan IELTS tayyorgarlik</span>
          </div>
          <h1 className="landing-title">
            IELTS maqsadingizga <br />
            <span className="landing-title-accent">aniq reja</span> bilan yeting
          </h1>
          <p className="landing-desc">
            IELTSify sizga shunchaki testlar emas — individual o'quv rejasi, AI
            tahlil va real vaqtda progress kuzatish imkonini beradi.
          </p>
          <div className="landing-hero-btns">
            <Link to="/register" className="landing-btn-primary">
              Bepul boshlash <ArrowRight size={16} />
            </Link>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat">
              <strong>4 skill</strong>
              <span>Reading, Listening, Writing, Speaking</span>
            </div>
            <div className="landing-stat">
              <strong>AI tahlil</strong>
              <span>Band score + feedback</span>
            </div>
            <div className="landing-stat">
              <strong>Individual reja</strong>
              <span>Har hafta yangilanadi</span>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="landing-section">
        <h2 className="landing-section-title">Platformada nimaga erishasiz?</h2>
        <p className="landing-section-desc">
          Ro'yxatdan o'tganingizdan boshlab imtihon kunigacha — har bir qadam
          rejalashtirilgan
        </p>
        <div className="landing-features-grid">
          {[
            {
              icon: <Target size={22} />,
              title: "Maqsad belgilash",
              desc: "Hozirgi darajangiz va maqsad balingizni kiriting — platforma sizga mos reja tuzadi",
            },
            {
              icon: <Calendar size={22} />,
              title: "Kunlik reja",
              desc: "Har kuni nima qilish kerakligini aniq bilasiz — vaqtingizga mos mashqlar",
            },
            {
              icon: <BookOpen size={22} />,
              title: "Reading mashqlari",
              desc: "IELTS formatidagi passagelar, savol turlari va vaqt boshqaruvi",
            },
            {
              icon: <Headphones size={22} />,
              title: "Listening testlar",
              desc: "Audio bilan real imtihon muhiti — bir marta tinglash rejimi",
            },
            {
              icon: <PenLine size={22} />,
              title: "Writing AI tahlil",
              desc: "Essay yozing — AI band score, xatolar va yaxshilash yo'llarini ko'rsatadi",
            },
            {
              icon: <Mic size={22} />,
              title: "Speaking AI",
              desc: "Gapiring — AI talaffuz, grammatika va fluency bo'yicha baho beradi",
            },
            {
              icon: <Brain size={22} />,
              title: "Zaif tomonlar",
              desc: "Platforma zaif joylaringizni aniqlaydi va ularga ko'proq e'tibor qaratadi",
            },
            {
              icon: <TrendingUp size={22} />,
              title: "Progress kuzatish",
              desc: "Haftalik va oylik natijalaringizni diagrammalar orqali ko'ring",
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
        <h2 className="landing-section-title">Qanday ishlaydi?</h2>
        <div className="landing-steps">
          {[
            {
              num: "1",
              title: "Ro'yxatdan o'ting",
              desc: "Hozirgi darajangiz, maqsadingiz va imtihon sanangizni kiriting",
            },
            {
              num: "2",
              title: "Individual reja oling",
              desc: "Platforma sizga mos haftalik o'quv reja tuzadi",
            },
            {
              num: "3",
              title: "Har kuni mashq qiling",
              desc: "Reading, Listening, Writing, Speaking — har kuni aniq topshiriqlar",
            },
            {
              num: "4",
              title: "Natijangizni ko'ring",
              desc: "AI tahlil, progress va yangilangan tavsiyalar",
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
        <h2 className="landing-section-title">Oddiy va tushunarli tariflar</h2>
        <p className="landing-section-desc">
          Bepul boshlang, kerak bo'lganda premium'ga o'ting
        </p>
        <div className="landing-pricing-grid">
          <div className="landing-price-card">
            <h3>Free</h3>
            <div className="landing-price">
              0 <span>UZS</span>
            </div>
            <ul>
              <li>
                <CheckCircle size={14} /> Kuniga 1 Reading
              </li>
              <li>
                <CheckCircle size={14} /> Kuniga 1 Listening
              </li>
              <li>
                <CheckCircle size={14} /> Haftasiga 1 Writing AI
              </li>
              <li>
                <CheckCircle size={14} /> Vocabulary mashqlari
              </li>
            </ul>
            <Link to="/register" className="landing-price-btn">
              Bepul boshlash
            </Link>
          </div>
          <div className="landing-price-card featured">
            <div className="landing-price-badge">Tavsiya</div>
            <h3>IELTSify Monthly</h3>
            <div className="landing-price">
              29 900 <span>UZS / oy</span>
            </div>
            <ul>
              <li>
                <CheckCircle size={14} /> Cheksiz Reading va Listening
              </li>
              <li>
                <CheckCircle size={14} /> 20 ta Writing AI tahlil
              </li>
              <li>
                <CheckCircle size={14} /> 20 ta Speaking AI tahlil
              </li>
              <li>
                <CheckCircle size={14} /> Individual haftalik reja
              </li>
              <li>
                <CheckCircle size={14} /> Full Mock Exam
              </li>
              <li>
                <CheckCircle size={14} /> 70 bonus coin
              </li>
            </ul>
            <Link to="/register" className="landing-price-btn primary">
              Sotib olish
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>IELTS maqsadingizga bugundan boshlang</h2>
        <p>Minglab talabalar allaqachon IELTSify bilan tayyorlanmoqda</p>
        <Link to="/register" className="landing-btn-primary">
          Bepul ro'yxatdan o'tish <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <strong>IELTSify</strong>
            <p>AI bilan IELTS tayyorgarlik platformasi</p>
          </div>
          <div className="landing-footer-links">
            <Link to="/login">Kirish</Link>
            <Link to="/register">Ro'yxatdan o'tish</Link>
          </div>
        </div>
        <div className="landing-footer-bottom">
          © {new Date().getFullYear()} IELTSify. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
