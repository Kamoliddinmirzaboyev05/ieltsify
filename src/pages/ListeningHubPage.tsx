import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Select,
  Empty,
  Spin,
  Button,
  Grid,
  message,
} from "antd";
import { Headphones, Play, Clock, BookOpen, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface ListeningTest {
  id: number;
  title: string;
  slug: string;
  description: string;
  html_file_url: string;
  cover_image_url: string;
  difficulty: "easy" | "medium" | "hard";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ListeningTestsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListeningTest[];
}

const ListeningHubPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<string>("all");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "https://api.ieltsfy.uz";
      const accessToken = localStorage.getItem("access_token");

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const response = await fetch(`${API_BASE_URL}/listening-tests/`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          message.error("Please sign in first");
          navigate("/login");
          return;
        }
        throw new Error("Failed to load listening tests");
      }

      const data: ListeningTestsResponse = await response.json();
      setTests(data.results);
    } catch (error) {
      console.error("Error loading listening tests:", error);
      message.error("Listening testlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (test: ListeningTest) => {
    navigate(`/dashboard/listening/${test.slug}`, { state: { test } });
  };

  const filteredTests =
    difficulty === "all"
      ? tests
      : tests.filter((t) => t.difficulty === difficulty);

  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      easy: "#16a34a",
      medium: "#d97706",
      hard: "#dc2626",
    };
    return colors[diff] || "#f6c34a";
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          marginBottom: "24px",
          gap: "12px",
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            <Headphones
              size={24}
              style={{
                marginRight: "8px",
                verticalAlign: "middle",
                color: "#f0b429",
              }}
            />
            Listening Tests
          </Title>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            IELTS Listening practice testlari bilan mashq qiling
          </Text>
        </div>
        <Select
          value={difficulty}
          onChange={setDifficulty}
          style={{ width: isMobile ? "100%" : "160px" }}
        >
          <Select.Option value="all">Barcha darajalar</Select.Option>
          <Select.Option value="easy">Oson</Select.Option>
          <Select.Option value="medium">O'rta</Select.Option>
          <Select.Option value="hard">Qiyin</Select.Option>
        </Select>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <Card
          size="small"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
          }}
          bodyStyle={{ padding: "14px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BookOpen size={18} color="#f6c34a" />
            <div>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Jami testlar
              </Text>
              <Text strong style={{ fontSize: "16px" }}>
                {tests.length}
              </Text>
            </div>
          </div>
        </Card>
        <Card
          size="small"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
          }}
          bodyStyle={{ padding: "14px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Clock size={18} color="#f59e0b" />
            <div>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Davomiyligi
              </Text>
              <Text strong style={{ fontSize: "16px" }}>
                30-40 min
              </Text>
            </div>
          </div>
        </Card>
        <Card
          size="small"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
          }}
          bodyStyle={{ padding: "14px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TrendingUp size={18} color="#f0b429" />
            <div>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Maksimal
              </Text>
              <Text strong style={{ fontSize: "16px" }}>
                Band 9.0
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: "12px" }}>
            <Text type="secondary">Yuklanmoqda...</Text>
          </div>
        </div>
      ) : filteredTests.length === 0 ? (
        <Empty
          description={
            difficulty === "all"
              ? "No tests available yet"
              : `${difficulty} tests not found for difficulty`
          }
          style={{ marginTop: "60px" }}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {filteredTests.map((test) => (
            <Card
              key={test.id}
              hoverable
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid var(--border-color)",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
              cover={
                <div
                  style={{
                    position: "relative",
                    height: "180px",
                    backgroundColor: "var(--bg-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {test.cover_image_url ? (
                    <img
                      alt={test.title}
                      src={test.cover_image_url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Headphones size={48} color="#94a3b8" />
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: getDifficultyColor(test.difficulty),
                      color: "#fff",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {test.difficulty}
                  </span>
                </div>
              }
            >
              <Title
                level={5}
                style={{ marginBottom: "8px", fontSize: "15px" }}
                ellipsis={{ rows: 2 }}
              >
                {test.title}
              </Title>
              <Paragraph
                type="secondary"
                style={{ fontSize: "12px", marginBottom: "12px" }}
                ellipsis={{ rows: 2 }}
              >
                {test.description || "IELTS Listening practice test"}
              </Paragraph>
              <Button
                type="primary"
                block
                icon={<Play size={14} />}
                onClick={() => handleStartTest(test)}
                style={{
                  borderRadius: "6px",
                  height: "36px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "#f0b429",
                  border: "none",
                }}
              >
                Testni boshlash
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeningHubPage;
