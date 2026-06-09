import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Grid, Progress, Empty } from "antd";
import {
  TrendingUp,
  Calendar,
  BookOpen,
  Headphones,
  PenLine,
  Mic,
  Award,
  Flame,
} from "lucide-react";
import { authenticatedFetch } from "../services/authService";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ReportData {
  user_info: any;
  daily_statistics: {
    total_days_active: number;
    current_streak: number;
    longest_streak: number;
    total_vocab_learned: number;
    total_writing_evaluations: number;
    total_speaking_mocks: number;
    total_reading_attempts: number;
    total_listening_attempts: number;
  };
  weekly_progress: Array<{
    date: string;
    vocab: number;
    writing: number;
    speaking: number;
    reading: number;
    listening: number;
  }>;
  monthly_summary: any;
  achievements: Record<string, boolean>;
  recommendations: string[];
}

const ReportsPage: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await authenticatedFetch("/my-report/");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReport(data.data);
        }
      }
    } catch (err) {
      console.error("Failed to load report:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: isMobile ? "16px" : "24px" }}>
        <div
          style={{
            height: "24px",
            width: "150px",
            backgroundColor: "rgba(148,163,184,0.1)",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        />
        <Row gutter={[12, 12]}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={12} md={6} key={i}>
              <div
                style={{
                  height: "80px",
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
            marginTop: "16px",
            height: "200px",
            backgroundColor: "rgba(148,163,184,0.06)",
            borderRadius: "6px",
            border: "1px solid rgba(148,163,184,0.08)",
          }}
        />
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ padding: "24px" }}>
        <Title level={4} style={{ margin: "0 0 16px 0" }}>
          My Reports
        </Title>
        <Empty description="Hali yetarli ma'lumot yo'q. Mashqlarni boshlang!" />
      </div>
    );
  }

  const stats = report.daily_statistics;
  const totalActivities =
    stats.total_vocab_learned +
    stats.total_writing_evaluations +
    stats.total_speaking_mocks +
    stats.total_reading_attempts +
    stats.total_listening_attempts;

  const skillBreakdown = [
    {
      label: "Reading",
      value: stats.total_reading_attempts,
      icon: <BookOpen size={16} />,
      color: "#3b82f6",
    },
    {
      label: "Listening",
      value: stats.total_listening_attempts,
      icon: <Headphones size={16} />,
      color: "#8b5cf6",
    },
    {
      label: "Writing",
      value: stats.total_writing_evaluations,
      icon: <PenLine size={16} />,
      color: "#f59e0b",
    },
    {
      label: "Speaking",
      value: stats.total_speaking_mocks,
      icon: <Mic size={16} />,
      color: "#ef4444",
    },
    {
      label: "Vocabulary",
      value: stats.total_vocab_learned,
      icon: <TrendingUp size={16} />,
      color: "#10b981",
    },
  ];

  const achievements = report.achievements;
  const achievementList = [
    { key: "vocab_master", label: "Vocab Master", desc: "100+ so'z o'rgangan" },
    {
      key: "writing_champion",
      label: "Writing Champion",
      desc: "20+ essay baholangan",
    },
    { key: "speaking_star", label: "Speaking Star", desc: "10+ speaking mock" },
    {
      key: "reading_enthusiast",
      label: "Reading Enthusiast",
      desc: "30+ reading attempt",
    },
    {
      key: "listening_expert",
      label: "Listening Expert",
      desc: "25+ listening attempt",
    },
    {
      key: "consistency_king",
      label: "Consistency King",
      desc: "7 kunlik streak",
    },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "24px", maxWidth: "1100px" }}>
      <Title level={4} style={{ margin: "0 0 20px 0", fontWeight: 700 }}>
        My Reports
      </Title>

      {/* Top Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: "20px" }}>
        <Col xs={8} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <Flame size={18} color="#f59e0b" style={{ marginBottom: "4px" }} />
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              {stats.current_streak}
            </div>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Streak
            </Text>
          </Card>
        </Col>
        <Col xs={8} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <Calendar
              size={18}
              color="#3b82f6"
              style={{ marginBottom: "4px" }}
            />
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              {stats.total_days_active}
            </div>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Faol kun
            </Text>
          </Card>
        </Col>
        <Col xs={8} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <Award size={18} color="#10b981" style={{ marginBottom: "4px" }} />
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              {stats.longest_streak}
            </div>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Eng uzun
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card
            size="small"
            style={{
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              textAlign: "center",
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <TrendingUp
              size={18}
              color="#8b5cf6"
              style={{ marginBottom: "4px" }}
            />
            <div style={{ fontSize: "18px", fontWeight: 700 }}>
              {totalActivities}
            </div>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Jami mashq
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Weekly Progress */}
      <Card
        size="small"
        style={{
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          marginBottom: "20px",
        }}
        bodyStyle={{ padding: "14px" }}
      >
        <Text
          strong
          style={{ fontSize: "13px", display: "block", marginBottom: "12px" }}
        >
          Haftalik faoliyat
        </Text>
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "flex-end",
            height: "60px",
          }}
        >
          {report.weekly_progress.map((day, i) => {
            const total =
              day.vocab +
              day.writing +
              day.speaking +
              day.reading +
              day.listening;
            const maxHeight = 56;
            const height = Math.max(
              4,
              (total /
                Math.max(
                  1,
                  ...report.weekly_progress.map(
                    (d) =>
                      d.vocab +
                      d.writing +
                      d.speaking +
                      d.reading +
                      d.listening,
                  ),
                )) *
                maxHeight,
            );
            const dayName = new Date(day.date).toLocaleDateString("uz-UZ", {
              weekday: "short",
            });
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "28px",
                    height: `${height}px`,
                    backgroundColor: total > 0 ? "#10b981" : "var(--border-color)",
                    borderRadius: "3px",
                    transition: "height 0.3s",
                  }}
                />
                <Text style={{ fontSize: "10px", color: "#94a3b8" }}>
                  {dayName}
                </Text>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Skill Breakdown */}
      <Card
        size="small"
        style={{
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          marginBottom: "20px",
        }}
        bodyStyle={{ padding: "14px" }}
      >
        <Text
          strong
          style={{ fontSize: "13px", display: "block", marginBottom: "12px" }}
        >
          Ko'nikmalar bo'yicha
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {skillBreakdown.map((skill) => (
            <div
              key={skill.label}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div style={{ color: skill.color, width: "20px" }}>
                {skill.icon}
              </div>
              <Text style={{ fontSize: "12px", width: "70px" }}>
                {skill.label}
              </Text>
              <div style={{ flex: 1 }}>
                <Progress
                  percent={
                    totalActivities > 0
                      ? Math.round((skill.value / totalActivities) * 100)
                      : 0
                  }
                  strokeColor={skill.color}
                  trailColor="var(--border-color)"
                  size="small"
                  showInfo={false}
                />
              </div>
              <Text
                strong
                style={{ fontSize: "12px", width: "30px", textAlign: "right" }}
              >
                {skill.value}
              </Text>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card
        size="small"
        style={{
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          marginBottom: "20px",
        }}
        bodyStyle={{ padding: "14px" }}
      >
        <Text
          strong
          style={{ fontSize: "13px", display: "block", marginBottom: "12px" }}
        >
          Yutuqlar
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          {achievementList.map((ach) => {
            const unlocked = achievements[ach.key];
            return (
              <div
                key={ach.key}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: `1px solid ${unlocked ? "#bbf7d0" : "var(--border-color)"}`,
                  backgroundColor: unlocked ? "rgba(16, 185, 129, 0.08)" : "var(--bg-secondary)",
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: "11px",
                    display: "block",
                    color: unlocked ? "#16a34a" : "#94a3b8",
                  }}
                >
                  {unlocked ? "✓ " : ""}
                  {ach.label}
                </Text>
                <Text style={{ fontSize: "10px", color: "#94a3b8" }}>
                  {ach.desc}
                </Text>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <Card
          size="small"
          style={{ borderRadius: "6px", border: "1px solid var(--border-color)" }}
          bodyStyle={{ padding: "14px" }}
        >
          <Text
            strong
            style={{ fontSize: "13px", display: "block", marginBottom: "10px" }}
          >
            Tavsiyalar
          </Text>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {report.recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    marginTop: "6px",
                    flexShrink: 0,
                  }}
                />
                <Text style={{ fontSize: "12px", color: "#64748b" }}>
                  {rec}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
