import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Progress, Grid } from "antd";
import {
  Target,
  Headphones,
  BookOpen,
  Mic,
  PenLine,
  Calendar,
  Flame,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  type ProfileData,
  authenticatedFetch,
} from "../services/authService";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface DailyUsage {
  vocab_learned_count?: number;
  writing_evaluation_count?: number;
  speaking_mock_count?: number;
  reading_attempt_count?: number;
  listening_attempt_count?: number;
}

interface DashboardData {
  profile: ProfileData | null;
  wallet: { balance: number } | null;
  dailyUsage: DailyUsage | null;
  loading: boolean;
}

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [data, setData] = useState<DashboardData>({
    profile: null,
    wallet: null,
    dailyUsage: null,
    loading: true,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [profile, walletRes, usageRes] = await Promise.allSettled([
        fetchUserProfile(),
        authenticatedFetch("/subs/wallet/"),
        authenticatedFetch("/attempts/today-usage/"),
      ]);

      const profileData = profile.status === "fulfilled" ? profile.value : null;

      let walletData = null;
      if (walletRes.status === "fulfilled" && walletRes.value.ok) {
        walletData = await walletRes.value.json();
      }

      let usageData = null;
      if (usageRes.status === "fulfilled" && usageRes.value.ok) {
        usageData = await usageRes.value.json();
      }

      setData({
        profile: profileData,
        wallet: walletData,
        dailyUsage: usageData,
        loading: false,
      });
    } catch {
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  if (data.loading) {
    return (
      <div style={{ padding: "32px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              height: "28px",
              width: "200px",
              backgroundColor: "rgba(148,163,184,0.1)",
              borderRadius: "4px",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              height: "16px",
              width: "300px",
              backgroundColor: "rgba(148,163,184,0.08)",
              borderRadius: "4px",
            }}
          />
        </div>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={12} md={6} key={i}>
              <div
                style={{
                  height: "100px",
                  backgroundColor: "rgba(148,163,184,0.06)",
                  borderRadius: "6px",
                  border: "1px solid rgba(148,163,184,0.08)",
                }}
              />
            </Col>
          ))}
        </Row>
        <div
          style={{
            marginTop: "24px",
            height: "200px",
            backgroundColor: "rgba(148,163,184,0.06)",
            borderRadius: "6px",
            border: "1px solid rgba(148,163,184,0.08)",
          }}
        />
      </div>
    );
  }

  const profile = data.profile;
  const currentBand = profile?.skills
    ? (profile.skills.listening +
        profile.skills.reading +
        profile.skills.writing +
        profile.skills.speaking) /
      4
    : 0;
  const targetBand = profile?.target_score || 7.0;
  const progressPct =
    targetBand > 0 ? Math.min((currentBand / targetBand) * 100, 100) : 0;

  const weakSkills: string[] = profile?.weak_skills || [];
  const strongSkills: string[] = profile?.strong_skills || [];
  const dailyHours = profile?.daily_study_hours ?? 0;
  const examDate = profile?.target_date;

  const daysUntilExam = examDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  const usage = data.dailyUsage;
  const todayTotal = usage
    ? (usage.vocab_learned_count || 0) +
      (usage.writing_evaluation_count || 0) +
      (usage.speaking_mock_count || 0) +
      (usage.reading_attempt_count || 0) +
      (usage.listening_attempt_count || 0)
    : 0;

  const quickActions = [
    {
      label: "Reading",
      icon: <BookOpen size={18} />,
      path: "/dashboard/reading-hub",
      color: "#f6c34a",
    },
    {
      label: "Listening",
      icon: <Headphones size={18} />,
      path: "/dashboard/listening-hub",
      color: "#8b5cf6",
    },
    {
      label: "Writing",
      icon: <PenLine size={18} />,
      path: "/dashboard/writing",
      color: "#f59e0b",
    },
    {
      label: "Speaking",
      icon: <Mic size={18} />,
      path: "/dashboard/speaking",
      color: "#ef4444",
    },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "24px", maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={4} style={{ margin: "0 0 4px 0", fontWeight: 700 }}>
          Salom, {profile?.first_name || "User"} 👋
        </Title>
        <Text type="secondary" style={{ fontSize: "13px" }}>
          Bugungi mashqlaringizni davom eting
        </Text>
      </div>

      {/* Stats Row */}
      <Row gutter={[12, 12]} style={{ marginBottom: "20px" }}>
        <Col xs={12} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
            }}
            bodyStyle={{ padding: "14px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(240, 180, 41, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Target size={18} color="#16a34a" />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: "11px", display: "block" }}
                >
                  Maqsad
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {targetBand}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
            }}
            bodyStyle={{ padding: "14px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Flame size={18} color="#d97706" />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: "11px", display: "block" }}
                >
                  Bugun
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {todayTotal} mashq
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
            }}
            bodyStyle={{ padding: "14px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={18} color="#7c3aed" />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: "11px", display: "block" }}
                >
                  Kunlik
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {dailyHours}h reja
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
            }}
            bodyStyle={{ padding: "14px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(225, 29, 72, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={18} color="#e11d48" />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: "11px", display: "block" }}
                >
                  Imtihon
                </Text>
                <Text strong style={{ fontSize: "16px" }}>
                  {daysUntilExam !== null ? `${daysUntilExam} kun` : "—"}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Progress Card */}
      <Card
        size="small"
        style={{
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          marginBottom: "20px",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text strong style={{ fontSize: "13px" }}>
            Maqsadga yo'l
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {currentBand.toFixed(1)} / {targetBand}
          </Text>
        </div>
        <Progress
          percent={Math.round(progressPct)}
          strokeColor="#f0b429"
          trailColor="var(--border-color)"
          size="small"
        />
      </Card>

      {/* Quick Actions */}
      <div style={{ marginBottom: "20px" }}>
        <Text
          strong
          style={{ fontSize: "13px", display: "block", marginBottom: "10px" }}
        >
          Tez boshlash
        </Text>
        <Row gutter={[10, 10]}>
          {quickActions.map((action) => (
            <Col xs={12} md={6} key={action.label}>
              <div
                onClick={() => navigate(action.path)}
                style={{
                  padding: "14px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.15s",
                  backgroundColor: "var(--bg-card)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                <div style={{ color: action.color }}>{action.icon}</div>
                <Text style={{ fontSize: "13px", fontWeight: 500 }}>
                  {action.label}
                </Text>
                <ArrowRight
                  size={14}
                  style={{ marginLeft: "auto", color: "#94a3b8" }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Mock Exam Card */}
      <div
        onClick={() => navigate("/dashboard/mock-exam")}
        style={{
          marginBottom: "20px",
          padding: "18px",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-card)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#f0b429";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "6px",
            backgroundColor: "rgba(240, 180, 41, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Target size={20} color="#f0b429" />
        </div>
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: "14px", display: "block" }}>
            Full Mock Exam
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Haqiqiy IELTS imtihon muhitida o'zingizni sinab ko'ring
          </Text>
        </div>
        <ArrowRight size={16} style={{ color: "#94a3b8" }} />
      </div>

      {/* Weak & Strong Skills */}
      <Row gutter={[12, 12]}>
        {weakSkills.length > 0 && (
          <Col xs={24} md={12}>
            <Card
              size="small"
              style={{
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
              }}
              bodyStyle={{ padding: "14px" }}
            >
              <Text
                strong
                style={{
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Zaif tomonlar
              </Text>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {weakSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: "rgba(239, 68, 68, 0.08)",
                      color: "#dc2626",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </Col>
        )}
        {strongSkills.length > 0 && (
          <Col xs={24} md={12}>
            <Card
              size="small"
              style={{
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
              }}
              bodyStyle={{ padding: "14px" }}
            >
              <Text
                strong
                style={{
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Kuchli tomonlar
              </Text>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {strongSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: "rgba(240, 180, 41, 0.08)",
                      color: "#16a34a",
                      border: "1px solid rgba(240, 180, 41, 0.2)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Coin Balance */}
      {data.wallet && (
        <Card
          size="small"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
            marginTop: "12px",
          }}
          bodyStyle={{ padding: "14px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src="/coin.png"
                alt="coin"
                style={{ width: "20px", height: "20px" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <Text style={{ fontSize: "13px" }}>Coin balansingiz</Text>
            </div>
            <Text strong style={{ fontSize: "15px", color: "#f0b429" }}>
              {data.wallet.balance}
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardHome;
