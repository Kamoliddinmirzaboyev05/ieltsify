import React, { useState, useEffect } from "react";
import { message } from "antd";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUser,
  googleAuth,
  saveAuthTokens,
  saveUserProfile,
} from "../services/authService";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const googleEnabled =
    import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true" &&
    !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleEnabled) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
        });
        const btn = document.getElementById("google-btn");
        if (btn) {
          window.google.accounts.id.renderButton(btn, {
            theme: "filled_black",
            size: "large",
            width: btn.offsetWidth,
            text: "signin_with",
            shape: "rectangular",
          });
        }
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      message.success("Successfully signed in with Google!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Google sign-in error";
      message.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      message.error("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ username: email, password });
      const accessToken = response.access || response.access_token;
      const refreshToken = response.refresh || response.refresh_token;

      if (!accessToken || !refreshToken) throw new Error("Tokens not found");

      saveAuthTokens(accessToken, refreshToken);
      if (response.user) saveUserProfile(response.user);

      message.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Login error";
      message.error(
        msg.includes("credentials") ? "Invalid email or password" : msg,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <img
              src="/logohead.png"
              alt="IELTSify"
              className="auth-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Email or Username</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="auth-input"
                  autoComplete="email"
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
                  placeholder="••••••••"
                  className="auth-input"
                  autoComplete="current-password"
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

            <div className="auth-options">
              <label className="auth-checkbox-label">
                <input type="checkbox" className="auth-checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link-small">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading || googleLoading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Google Sign-In */}
          {googleEnabled && (
            <>
              <div className="auth-divider">
                <span>or</span>
              </div>
              <div
                id="google-btn"
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
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;