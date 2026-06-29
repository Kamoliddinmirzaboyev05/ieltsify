import React, { useState, useEffect } from "react";
import { message } from "antd";
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

      if (!accessToken || !refreshToken) throw new Error("Tokens not found");

      saveAuthTokens(accessToken, refreshToken);
      if (authResponse.user) saveUserProfile(authResponse.user);

      message.success("Successfully registered with Google!");
      setStep(1);
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Google registration error";
      message.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

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
      message.error("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      message.error("Password must be at least 8 characters");
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
      if (!accessToken || !refreshToken) throw new Error("Tokens not found");

      saveAuthTokens(accessToken, refreshToken);
      if (response.user) saveUserProfile(response.user);
      setStep(1);
    } catch (error: unknown) {
      message.error(
        error instanceof Error ? error.message : "Registration error",
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
      if (!response.ok) throw new Error("Failed to save");
      message.success("Congratulations! Your profile is ready.");
      navigate("/dashboard");
    } catch {
      message.error("Failed to save");
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
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">
                Start your IELTS preparation journey
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
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="First Last"
                    className="auth-input"
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
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
                {loading ? "Loading..." : "Continue"}
              </button>
            </form>
            {googleEnabled && (
              <>
                <div className="auth-divider">
                  <span>or</span>
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
                    Signing in with Google...
                  </p>
                )}
              </>
            )}
            <p className="auth-footer">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign In
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
            <h2 className="onboard-title">Exam Type</h2>
            <p className="onboard-desc">
              Which IELTS exam are you preparing for?
            </p>
            <div className="onboard-options-row">
              {[
                { key: "academic", label: "Academic", desc: "University admission" },
                { key: "general", label: "General Training", desc: "Work or migration" },
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
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="onboard-step">
            <div className="onboard-icon">
              <Target size={24} />
            </div>
            <h2 className="onboard-title">Level & Goal</h2>
            <p className="onboard-desc">
              Set your current and target band score
            </p>
            <div className="onboard-band-group">
              <label className="band-label">
                Current Level <strong>{currentBand}</strong>
              </label>
              <div className="band-picker">
                {Array.from({ length: 13 }, (_, i) => 3 + i * 0.5).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`band-pill ${currentBand === v ? "selected" : ""}`}
                    onClick={() => setCurrentBand(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="onboard-band-group">
              <label className="band-label">
                Target Score <strong>{targetBand}</strong>
              </label>
              <div className="band-picker">
                {Array.from({ length: 9 }, (_, i) => 5 + i * 0.5).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`band-pill ${targetBand === v ? "selected" : ""}`}
                    onClick={() => setTargetBand(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">Target Exam Date (approx)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="auth-input"
              />
            </div>
            <div className="onboard-btns">
              <button className="auth-btn-secondary" onClick={prevStep}>
                Back
              </button>
              <button className="auth-btn" onClick={nextStep}>
                Continue
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
            <h2 className="onboard-title">Daily Study Time</h2>
            <p className="onboard-desc">How much time can you dedicate per day?</p>
            <div className="onboard-grid">
              {[
                { v: 0.5, l: "30 minutes" },
                { v: 1, l: "1 hour" },
                { v: 2, l: "2 hours" },
                { v: 3, l: "3+ hours" },
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
                Back
              </button>
              <button className="auth-btn" onClick={nextStep}>
                Continue
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
            <h2 className="onboard-title">Strengths & Weaknesses</h2>
            <p className="onboard-desc">
              Which skills are your strengths and weaknesses?
            </p>
            <div className="onboard-skills-section">
              <label className="auth-label">Weak Areas:</label>
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
              <label className="auth-label">Strong Areas:</label>
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
                Back
              </button>
              <button className="auth-btn" onClick={nextStep} disabled={loading}>
                {loading ? "Saving..." : "Finish"}
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
            <span>Back</span>
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