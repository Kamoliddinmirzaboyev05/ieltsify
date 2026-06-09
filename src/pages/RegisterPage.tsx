import React, { useState, useEffect } from "react";
import { message, Slider } from "antd";
import {
  Lock,
  Mail,
  User,
  ArrowLeft,
  Target,
  Clock,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  registerUser,
  googleAuth,
  saveAuthTokens,
  saveUserProfile,
  authenticatedFetch,
} from "../services/authService";

const SKILLS = [
  { key: "listening", label: "Listening" },
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const googleEnabled =
    import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true" &&
    !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleEnabled || step !== 0) return;

    const timer = setTimeout(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
        });
        const btn = document.getElementById("google-btn-register");
        if (btn) {
          window.google.accounts.id.renderButton(btn, {
            theme: "filled_black",
            size: "large",
            width: btn.offsetWidth,
            text: "signup_with",
            shape: "rectangular",
          });
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [step]);

  const handleGoogleResponse = async (response: { credential: string }) => {
    if (!response.credential) return;
    setGoogleLoading(true);
    try {
      const authResponse = await googleAuth(response.credential);
      const accessToken =
        authResponse.tokens?.access ||
        authResponse.access ||
        authResponse.access_token;
      const refreshToken =
        authResponse.tokens?.refresh ||
        authResponse.refresh ||
        authResponse.refresh_token;

      if (!accessToken || !refreshToken) throw new Error("Tokenlar topilmadi");

      saveAuthTokens(accessToken, refreshToken);
      if (authResponse.user) saveUserProfile(authResponse.user);

      message.success("Google orqali muvaffaqiyatli ro'yxatdan o'tdingiz!");
      setStep(1); // Onboarding'ga o'tish
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Google orqali ro'yxatdan o'tishda xatolik";
      message.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Registration fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  // Onboarding fields
  const [currentBand, setCurrentBand] = useState<number>(5.0);
  const [targetBand, setTargetBand] = useState<number>(7.0);
  const [examType, setExamType] = useState<string>("academic");
  const [dailyHours, setDailyHours] = useState<number>(1);
  const [weakSkills, setWeakSkills] = useState<string[]>([]);
  const [strongSkills, setStrongSkills] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState<string>("");

  const totalSteps = 5;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !username.trim() ||
      !email.trim() ||
      !fullName.trim() ||
      !password.trim()
    ) {
      message.error("Barcha maydonlarni to'ldiring");
      return;
    }
    if (password.length < 8) {
      message.error("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);
    try {
      const nameParts = fullName.trim().split(/\s+/);
      const response = await registerUser({
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        password,
      });

      const accessToken =
        response.tokens?.access || response.access || response.access_token;
      const refreshToken =
        response.tokens?.refresh || response.refresh || response.refresh_token;
      if (!accessToken || !refreshToken) throw new Error("Tokenlar topilmadi");

      saveAuthTokens(accessToken, refreshToken);
      if (response.user) saveUserProfile(response.user);
      setStep(1);
    } catch (error: unknown) {
      message.error(
        error instanceof Error ? error.message : "Ro'yxatdan o'tishda xatolik",
      );
    } finally {
      setLoading(false);
    }
  };

  const saveOnboarding = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch("/accounts/profile/", {
        method: "PATCH",
        body: JSON.stringify({
          current_band_score: currentBand,
          target_band_score: targetBand,
          exam_type: examType,
          daily_study_hours: dailyHours,
          weak_skills: weakSkills,
          strong_skills: strongSkills,
          target_date: targetDate || undefined,
          onboarding_completed: true,
        }),
      });
      if (!response.ok) throw new Error("Saqlashda xatolik");
      message.success("Tabriklaymiz! Profilingiz tayyor.");
      navigate("/dashboard");
    } catch {
      message.error("Saqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else saveOnboarding();
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSkill = (skill: string, type: "weak" | "strong") => {
    if (type === "weak") {
      setWeakSkills((prev) =>
        prev.includes(skill)
          ? prev.filter((s) => s !== skill)
          : [...prev, skill],
      );
      setStrongSkills((prev) => prev.filter((s) => s !== skill));
    } else {
      setStrongSkills((prev) =>
        prev.includes(skill)
          ? prev.filter((s) => s !== skill)
          : [...prev, skill],
      );
      setWeakSkills((prev) => prev.filter((s) => s !== skill));
    }
  };

  const renderProgress = () => (
    <div className="auth-progress">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`auth-progress-bar ${i <= step ? "active" : ""}`}
        />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Ro'yxatdan o'tish</h1>
              <p className="auth-subtitle">
                IELTS tayyorgarligingizni boshlang
              </p>
            </div>
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Username</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="auth-input"
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="auth-input"
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">To'liq ism</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ism Familiya"
                    className="auth-input"
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">Parol</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 8 belgi"
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Yuklanmoqda..." : "Davom etish"}
              </button>
            </form>
            {googleEnabled && (
              <>
                <div className="auth-divider">
                  <span>yoki</span>
                </div>
                <div
                  id="google-btn-register"
                  className="auth-google-btn"
                  style={{
                    opacity: googleLoading ? 0.5 : 1,
                    pointerEvents: googleLoading ? "none" : "auto",
                  }}
                />
                {googleLoading && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "12px",
                      marginTop: "8px",
                    }}
                  >
                    Google orqali kirmoqda...
                  </p>
                )}
              </>
            )}
            <p className="auth-footer">
              Akkauntingiz bormi?{" "}
              <Link to="/login" className="auth-link">
                Kirish
              </Link>
            </p>
          </>
        );

      case 1:
        return (
          <div className="onboard-step">
            <div className="onboard-icon">
              <BookOpen size={24} />
            </div>
            <h2 className="onboard-title">Imtihon turi</h2>
            <p className="onboard-desc">
              Qaysi IELTS imtihoniga tayyorlanmoqdasiz?
            </p>
            <div className="onboard-options-row">
              {[
                {
                  key: "academic",
                  label: "Academic",
                  desc: "Universitetga kirish",
                },
                {
                  key: "general",
                  label: "General Training",
                  desc: "Ish yoki migratsiya",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`onboard-option ${examType === item.key ? "selected" : ""}`}
                  onClick={() => setExamType(item.key)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
            <button className="auth-btn" onClick={nextStep}>
              Davom etish
            </button>
          </div>
        );

      case 2:
        return (
          <div className="onboard-step">
            <div className="onboard-icon">
              <Target size={24} />
            </div>
            <h2 className="onboard-title">Daraja va maqsad</h2>
            <p className="onboard-desc">
              Hozirgi va maqsad balingizni belgilang
            </p>
            <div className="onboard-slider-group">
              <label className="auth-label">
                Hozirgi daraja: <strong>{currentBand}</strong>
              </label>
              <Slider
                min={3}
                max={9}
                step={0.5}
                value={currentBand}
                onChange={setCurrentBand}
              />
            </div>
            <div className="onboard-slider-group">
              <label className="auth-label">
                Maqsad ball: <strong>{targetBand}</strong>
              </label>
              <Slider
                min={5}
                max={9}
                step={0.5}
                value={targetBand}
                onChange={setTargetBand}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Imtihon sanasi (taxminiy)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="auth-input"
              />
            </div>
            <div className="onboard-btns">
              <button className="auth-btn-secondary" onClick={prevStep}>
                Orqaga
              </button>
              <button className="auth-btn" onClick={nextStep}>
                Davom etish
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboard-step">
            <div className="onboard-icon">
              <Clock size={24} />
            </div>
            <h2 className="onboard-title">Kunlik vaqt</h2>
            <p className="onboard-desc">Kuniga qancha vaqt ajrata olasiz?</p>
            <div className="onboard-grid">
              {[
                { v: 0.5, l: "30 daqiqa" },
                { v: 1, l: "1 soat" },
                { v: 2, l: "2 soat" },
                { v: 3, l: "3+ soat" },
              ].map((item) => (
                <div
                  key={item.v}
                  className={`onboard-option compact ${dailyHours === item.v ? "selected" : ""}`}
                  onClick={() => setDailyHours(item.v)}
                >
                  <strong>{item.l}</strong>
                </div>
              ))}
            </div>
            <div className="onboard-btns">
              <button className="auth-btn-secondary" onClick={prevStep}>
                Orqaga
              </button>
              <button className="auth-btn" onClick={nextStep}>
                Davom etish
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="onboard-step">
            <div className="onboard-icon">
              <CheckCircle size={24} />
            </div>
            <h2 className="onboard-title">Kuchli va zaif tomonlar</h2>
            <p className="onboard-desc">
              Qaysi ko'nikmalaringiz kuchli, qaysilari zaif?
            </p>
            <div className="onboard-skills-section">
              <label className="auth-label">Zaif tomonlar:</label>
              <div className="onboard-chips">
                {SKILLS.map((s) => (
                  <div
                    key={`w-${s.key}`}
                    className={`onboard-chip weak ${weakSkills.includes(s.key) ? "selected" : ""}`}
                    onClick={() => toggleSkill(s.key, "weak")}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="onboard-skills-section">
              <label className="auth-label">Kuchli tomonlar:</label>
              <div className="onboard-chips">
                {SKILLS.map((s) => (
                  <div
                    key={`s-${s.key}`}
                    className={`onboard-chip strong ${strongSkills.includes(s.key) ? "selected" : ""}`}
                    onClick={() => toggleSkill(s.key, "strong")}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="onboard-btns">
              <button className="auth-btn-secondary" onClick={prevStep}>
                Orqaga
              </button>
              <button
                className="auth-btn"
                onClick={nextStep}
                disabled={loading}
              >
                {loading ? "Saqlanmoqda..." : "Tugatish"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {step === 0 && (
          <Link to="/" className="auth-back">
            <ArrowLeft size={16} />
            <span>Orqaga</span>
          </Link>
        )}
        <div className="auth-card">
          {step > 0 && renderProgress()}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
