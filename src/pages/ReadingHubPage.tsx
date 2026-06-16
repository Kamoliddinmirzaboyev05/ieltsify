import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Select,
  Empty,
  Spin,
  Button,
  Space,
  Tag,
  Grid,
  message,
} from "antd";
import { BookOpen, Play, Clock, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface ReadingPassage {
  id: number;
  title: string;
  slug: string;
  html_content_url: string;
  cover_image_url: string;
  difficulty: "easy" | "medium" | "hard";
  word_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ReadingPassagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReadingPassage[];
}

const ReadingHubPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<string>("all");

  useEffect(() => {
    loadPassages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPassages = async () => {
    setLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        "https://ieltsify.pythonanywhere.com";
      const accessToken = localStorage.getItem("access_token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/reading-passages/`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          message.error("Please sign in first");
          navigate("/login");
          return;
        }
        throw new Error("Failed to load reading passages");
      }

      const data: ReadingPassagesResponse = await response.json();
      // Show all passages (including inactive ones for development)
      setPassages(data.results);
      console.log("📊 Loaded passages:", data.results.length, "passages");
    } catch (error) {
      console.error("Error loading reading passages:", error);
      message.error("Reading passagelarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (passage: ReadingPassage) => {
    navigate(`/dashboard/reading/${passage.slug}`, { state: { passage } });
  };

  const filteredPassages =
    difficulty === "all"
      ? passages
      : passages.filter((p) => p.difficulty === difficulty);

  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      easy: "#52c41a",
      medium: "#faad14",
      hard: "#f5222d",
    };
    return colors[diff] || "#1890ff";
  };

  const getDifficultyIcon = (diff: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      easy: <TrendingUp size={16} style={{ transform: "rotate(-45deg)" }} />,
      medium: <TrendingUp size={16} />,
      hard: <TrendingUp size={16} style={{ transform: "rotate(45deg)" }} />,
    };
    return icons[diff] || <TrendingUp size={16} />;
  };

  const getReadingTime = (wordCount: number) => {
    const minutes = Math.ceil(wordCount / 225);
    return `${minutes} min`;
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          marginBottom: "32px",
          gap: isMobile ? "16px" : "0",
        }}
      >
        <div>
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "800",
            }}
          >
            <BookOpen
              size={isMobile ? 32 : 40}
              style={{
                marginRight: "12px",
                verticalAlign: "middle",
                color: "#3b82f6",
              }}
            />
            Reading Passages
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: isMobile ? "14px" : "16px" }}
          >
            IELTS Reading practice passagelari bilan mashq qiling
          </Text>
        </div>
        <Select
          value={difficulty}
          onChange={setDifficulty}
          style={{ width: isMobile ? "100%" : "200px" }}
          size="large"
        >
          <Select.Option value="all">Barcha darajalar</Select.Option>
          <Select.Option value="easy">Oson</Select.Option>
          <Select.Option value="medium">O'rta</Select.Option>
          <Select.Option value="hard">Qiyin</Select.Option>
        </Select>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <Card
          style={{
            borderRadius: "6px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <FileText
              size={20}
              style={{ marginBottom: "6px", color: "#3b82f6" }}
            />
            <Title level={3} style={{ margin: "4px 0" }}>
              {passages.length}
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Jami passagelar
            </Text>
          </div>
        </Card>
        <Card
          style={{
            borderRadius: "6px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <Clock
              size={20}
              style={{ marginBottom: "6px", color: "#f59e0b" }}
            />
            <Title level={3} style={{ margin: "4px 0" }}>
              60 min
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Test davomiyligi
            </Text>
          </div>
        </Card>
        <Card
          style={{
            borderRadius: "6px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <TrendingUp
              size={20}
              style={{ marginBottom: "6px", color: "#10b981" }}
            />
            <Title level={3} style={{ margin: "4px 0" }}>
              Band 9.0
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Maksimal ball
            </Text>
          </div>
        </Card>
      </motion.div>

      {/* Passages Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text type="secondary">Reading passagelar yuklanmoqda...</Text>
          </div>
        </div>
      ) : filteredPassages.length === 0 ? (
        <Empty
          description={
            <span>
              {difficulty === "all"
                ? "No reading passages available yet"
                : `${difficulty} passages not found for difficulty`}
            </span>
          }
          style={{ marginTop: "60px" }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredPassages.map((passage, index) => (
            <motion.div
              key={passage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                hoverable
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--border-color)",
                  boxShadow: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                cover={
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      alt={passage.title}
                      src={passage.cover_image_url}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.style.background = "var(--bg-secondary)";
                        target.parentElement!.style.display = "flex";
                        target.parentElement!.style.alignItems = "center";
                        target.parentElement!.style.justifyContent = "center";
                        target.parentElement!.innerHTML = `<div style="color: #94a3b8;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>`;
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: getDifficultyColor(passage.difficulty),
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {getDifficultyIcon(passage.difficulty)}
                      {passage.difficulty.charAt(0).toUpperCase() +
                        passage.difficulty.slice(1)}
                    </div>
                  </div>
                }
              >
                <div style={{ padding: "8px 0" }}>
                  <Title
                    level={4}
                    style={{
                      marginBottom: "12px",
                      fontSize: "18px",
                      fontWeight: "700",
                    }}
                    ellipsis={{ rows: 2 }}
                  >
                    {passage.title}
                  </Title>

                  <Paragraph
                    type="secondary"
                    style={{
                      marginBottom: "16px",
                      fontSize: "14px",
                      minHeight: "40px",
                    }}
                  >
                    {passage.word_count.toLocaleString()} words •{" "}
                    {getReadingTime(passage.word_count)} reading time
                  </Paragraph>

                  <Space style={{ marginBottom: "16px", flexWrap: "wrap" }}>
                    <Tag icon={<Clock size={14} />} color="blue">
                      {getReadingTime(passage.word_count)}
                    </Tag>
                    <Tag icon={<FileText size={14} />} color="purple">
                      {passage.word_count.toLocaleString()} words
                    </Tag>
                    {!passage.is_active && <Tag color="red">Nofaol</Tag>}
                  </Space>

                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<Play size={18} />}
                    onClick={() => handleStartTest(passage)}
                    style={{
                      borderRadius: "6px",
                      height: "42px",
                      fontWeight: "600",
                      fontSize: "14px",
                      background: "#3b82f6",
                      border: "none",
                    }}
                  >
                    Passageni o'qish
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ReadingHubPage;
