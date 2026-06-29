import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Button,
  Space,
  Avatar,
  Tag,
  message,
  Row,
  Col,
  Grid,
  Progress,
  Divider,
} from "antd";
import {
  Mic,
  MicOff,
  User,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Play,
} from "lucide-react";
import {
  SPEAKING_TESTS,
  SPEAKING_COLLECTIONS,
  SPEAKING_STATS,
  type SpeakingTest,
} from "../mockData";
import { evaluateSpeaking } from "../services/aiService";
import "./SpeakingPage.css";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

type PageState = "listing" | "exam";
type ExamPhase =
  | "intro"
  | "part1"
  | "part2-prep"
  | "part2-speak"
  | "part3"
  | "complete";
type RecordingState = "idle" | "recording" | "processing";

interface Answer {
  question: string;
  transcript: string;
  duration: number;
}

interface ExamSession {
  testId: string;
  part1Answers: Answer[];
  part2Answer: Answer | null;
  part3Answers: Answer[];
  startTime: number;
  endTime?: number;
}

const SpeakingPageNew: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [pageState, setPageState] = useState<PageState>("listing");
  const [selectedTest, setSelectedTest] = useState<SpeakingTest | null>(null);
  const [examPhase, setExamPhase] = useState<ExamPhase>("intro");
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalAnalysis, setFinalAnalysis] = useState<any>(null);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (recordingState === "recording") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTest = (collection: any) => {
    const test = SPEAKING_TESTS.find((t) => t.id === collection.id);
    if (!test) {
      message.error("Test not found");
      return;
    }
    setSelectedTest(test);
    setExamSession({
      testId: test.id,
      part1Answers: [],
      part2Answer: null,
      part3Answers: [],
      startTime: Date.now(),
    });
    setPageState("exam");
    setExamPhase("intro");
  };

  const startRecording = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      message.error(
        "Your browser doesn't support speech recognition. Please use Chrome/Edge.",
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = "en-US";

        reco.onstart = () => {
          setRecordingState("recording");
          setTranscript("");
          setTimer(0);
        };

        reco.onresult = (event: any) => {
          const transcriptValue = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(" ");
          setTranscript(transcriptValue);
        };

        reco.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === "not-allowed") {
            message.error(
              "Microphone access blocked. Please allow permissions.",
            );
            setRecordingState("idle");
          }
        };

        reco.start();
        setRecognition(reco);
      })
      .catch((err) => {
        console.error("Mic permission denied", err);
        message.error("Please allow microphone access to use this feature.");
      });
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setRecordingState("idle");
  };

  const saveAnswer = (question: string) => {
    if (!examSession || !transcript.trim()) {
      message.warning("Please provide an answer before continuing");
      return false;
    }

    const answer: Answer = {
      question,
      transcript: transcript.trim(),
      duration: timer,
    };

    if (examPhase === "part1") {
      setExamSession({
        ...examSession,
        part1Answers: [...examSession.part1Answers, answer],
      });
    } else if (examPhase === "part2-speak") {
      setExamSession({
        ...examSession,
        part2Answer: answer,
      });
    } else if (examPhase === "part3") {
      setExamSession({
        ...examSession,
        part3Answers: [...examSession.part3Answers, answer],
      });
    }

    setTranscript("");
    setTimer(0);
    return true;
  };

  const handleNextQuestion = () => {
    if (!selectedTest) return;

    if (examPhase === "intro") {
      setExamPhase("part1");
      setCurrentTopicIndex(0);
      setCurrentQuestionIndex(0);
      return;
    }

    if (examPhase === "part1") {
      const currentTopic = selectedTest.part1Topics[currentTopicIndex];
      const currentQuestion = currentTopic.questions[currentQuestionIndex];

      if (recordingState === "recording") {
        stopRecording();
      }

      if (!saveAnswer(currentQuestion)) return;

      if (currentQuestionIndex < currentTopic.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentTopicIndex < selectedTest.part1Topics.length - 1) {
        setCurrentTopicIndex(currentTopicIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        setExamPhase("part2-prep");
        setTimer(0);
      }
    } else if (examPhase === "part2-prep") {
      setExamPhase("part2-speak");
      setTimer(0);
    } else if (examPhase === "part2-speak") {
      if (recordingState === "recording") {
        stopRecording();
      }
      if (!saveAnswer(selectedTest.part2.cueCard)) return;
      setExamPhase("part3");
      setCurrentQuestionIndex(0);
    } else if (examPhase === "part3") {
      const currentQuestion =
        selectedTest.part3.questions[currentQuestionIndex];

      if (recordingState === "recording") {
        stopRecording();
      }

      if (!saveAnswer(currentQuestion)) return;

      if (currentQuestionIndex < selectedTest.part3.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setExamPhase("complete");
        analyzeExam();
      }
    }
  };

  const analyzeExam = async () => {
    if (!examSession) return;

    setIsAnalyzing(true);

    try {
      // Combine all answers for analysis
      const allAnswers = [
        ...examSession.part1Answers.map(
          (a) => `Q: ${a.question}\nA: ${a.transcript}`,
        ),
        examSession.part2Answer
          ? `Part 2: ${examSession.part2Answer.transcript}`
          : "",
        ...examSession.part3Answers.map(
          (a) => `Q: ${a.question}\nA: ${a.transcript}`,
        ),
      ].join("\n\n");

      const totalDuration =
        examSession.part1Answers.reduce((sum, a) => sum + a.duration, 0) +
        (examSession.part2Answer?.duration || 0) +
        examSession.part3Answers.reduce((sum, a) => sum + a.duration, 0);

      // Create comprehensive analysis prompt
      const analysisPrompt = `Act as an IELTS Speaking Examiner. Analyze this complete IELTS Speaking test performance.

FULL TRANSCRIPT:
${allAnswers}

Total Duration: ${Math.floor(totalDuration / 60)} minutes ${totalDuration % 60} seconds

Provide a comprehensive analysis in JSON format:
{
  "overall_band": 7.0,
  "fluency_coherence": 7.0,
  "lexical_resource": 7.0,
  "grammatical_range": 7.0,
  "pronunciation": 7.0,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "detailed_feedback": "Comprehensive feedback paragraph",
  "vocabulary_suggestions": ["word 1", "word 2", "word 3", "word 4", "word 5"]
}`;

      const result = await evaluateSpeaking(
        "Full IELTS Speaking Test",
        analysisPrompt,
      );

      // Parse the result if it's a string
      let analysis;
      if (typeof result === "string") {
        try {
          analysis = JSON.parse(result);
        } catch {
          analysis = {
            overall_band: 6.5,
            fluency_coherence: 6.5,
            lexical_resource: 6.5,
            grammatical_range: 6.5,
            pronunciation: 6.5,
            strengths: ["Good attempt at answering all questions"],
            weaknesses: ["Need more practice"],
            recommendations: ["Practice more speaking tests"],
            detailed_feedback: result,
            vocabulary_suggestions: ["enhance", "elaborate", "articulate"],
          };
        }
      } else {
        analysis = result;
      }

      setFinalAnalysis(analysis);
    } catch (error) {
      message.error("Failed to analyze exam. Please check your API key.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderListing = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "24px" : "40px",
      }}
    >
      <Row gutter={[isMobile ? 12 : 24, isMobile ? 12 : 24]}>
        {[
          {
            label: "Total Submissions",
            value: SPEAKING_STATS.totalSubmissions,
            icon: <Mic size={20} color="#ef4444" />,
            bg: "#fff1f2",
          },
          {
            label: "Average Score",
            value: SPEAKING_STATS.averageScore.toFixed(1),
            icon: <Award size={20} color="#f6c34a" />,
            bg: "#fdf7ea",
          },
          {
            label: "Highest Score",
            value: SPEAKING_STATS.highestScore.toFixed(1),
            icon: <CheckCircle size={20} color="#22c55e" />,
            bg: "#fdf8ec",
          },
          {
            label: "Practice Minutes",
            value: SPEAKING_STATS.practiceMinutes,
            icon: <Clock size={20} color="#a855f7" />,
            bg: "#faf5ff",
          },
        ].map((stat, i) => (
          <Col xs={12} sm={12} lg={6} key={i}>
            <Card
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <Text
                    type="secondary"
                    strong
                    style={{ fontSize: "10px", display: "block" }}
                  >
                    {stat.label}
                  </Text>
                  <Title
                    level={2}
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: isMobile ? "20px" : "28px",
                    }}
                  >
                    {stat.value}
                  </Title>
                </div>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: stat.bg,
                    borderRadius: "50%",
                    display: "flex",
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div>
        <Title level={4} style={{ marginBottom: "24px" }}>
          Full Mock Tests
        </Title>
        <Row gutter={[isMobile ? 16 : 24, isMobile ? 16 : 24]}>
          {SPEAKING_COLLECTIONS.filter((c) => c.recommended).map(
            (collection) => (
              <Col xs={24} md={12} lg={8} key={collection.id}>
                <Card
                  style={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
                    height: "100%",
                  }}
                >
                  <Tag
                    color="blue"
                    style={{
                      width: "fit-content",
                      borderRadius: "20px",
                      padding: "2px 12px",
                      marginBottom: "16px",
                    }}
                  >
                    Recommended
                  </Tag>
                  <Title
                    level={4}
                    style={{
                      fontSize: "18px",
                      marginBottom: "12px",
                      minHeight: "54px",
                    }}
                  >
                    {collection.title}
                  </Title>
                  <Paragraph
                    type="secondary"
                    style={{ fontSize: "14px", marginBottom: "24px" }}
                  >
                    {collection.description}
                  </Paragraph>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space>
                      <Clock size={14} color="#64748b" />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {collection.duration}
                      </Text>
                    </Space>
                    <Button
                      type="primary"
                      danger
                      onClick={() => handleStartTest(collection)}
                      style={{ borderRadius: "8px", fontWeight: "bold" }}
                    >
                      Start Test
                    </Button>
                  </div>
                </Card>
              </Col>
            ),
          )}
        </Row>
      </div>
    </div>
  );

  const renderExam = () => {
    if (!selectedTest) return null;

    if (examPhase === "intro") {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Card
            style={{
              borderRadius: "32px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <Avatar
              size={100}
              icon={<User size={50} />}
              style={{
                backgroundColor: "#f3e8ff",
                color: "#6B46C1",
                marginBottom: "24px",
              }}
            />
            <Title level={2}>IELTS Speaking Test</Title>
            <Title level={4} type="secondary">
              {selectedTest.title}
            </Title>
            <Divider />
            <div style={{ textAlign: "left", marginBottom: "32px" }}>
              <Paragraph>
                <strong>Part 1:</strong> Introduction & General Topics (4-5
                minutes)
              </Paragraph>
              <Paragraph>
                <strong>Part 2:</strong> Individual Long Turn with Cue Card (3-4
                minutes)
              </Paragraph>
              <Paragraph>
                <strong>Part 3:</strong> Two-way Discussion (4-5 minutes)
              </Paragraph>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleNextQuestion}
              icon={<Play size={20} />}
            >
              Begin Test
            </Button>
          </Card>
        </div>
      );
    }

    if (examPhase === "part1") {
      const currentTopic = selectedTest.part1Topics[currentTopicIndex];
      const currentQuestion = currentTopic.questions[currentQuestionIndex];
      const progress =
        ((currentTopicIndex * 4 + currentQuestionIndex + 1) /
          selectedTest.part1Topics.reduce(
            (sum, t) => sum + t.questions.length,
            0,
          )) *
        100;

      return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tag color="blue" style={{ fontSize: "14px", padding: "4px 16px" }}>
              Part 1: {currentTopic.topic}
            </Tag>
            <Text type="secondary">
              Question {currentQuestionIndex + 1} of{" "}
              {currentTopic.questions.length}
            </Text>
          </div>
          <Progress
            percent={Math.round(progress)}
            showInfo={false}
            strokeColor="#6B46C1"
            style={{ marginBottom: "24px" }}
          />

          <Card
            style={{
              borderRadius: "32px",
              padding: "60px 20px",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <Avatar
              size={120}
              icon={<User size={60} />}
              style={{
                backgroundColor: "#f3e8ff",
                color: "#6B46C1",
                marginBottom: "32px",
              }}
            />
            <Title
              level={3}
              style={{
                minHeight: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              "{currentQuestion}"
            </Title>

            <div style={{ marginTop: "40px" }}>
              <div
                className={
                  recordingState === "recording" ? "recording-indicator" : ""
                }
                style={{ width: "120px", height: "120px", margin: "0 auto" }}
              >
                <Button
                  onClick={() =>
                    recordingState === "idle"
                      ? startRecording()
                      : stopRecording()
                  }
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor:
                      recordingState === "recording" ? "#ef4444" : "#6B46C1",
                    color: "white",
                    border: "none",
                    boxShadow:
                      recordingState === "recording"
                        ? "0 0 30px rgba(239, 68, 68, 0.4)"
                        : "0 12px 24px rgba(107, 70, 193, 0.3)",
                  }}
                >
                  {recordingState === "recording" ? (
                    <MicOff size={48} />
                  ) : (
                    <Mic size={48} />
                  )}
                </Button>
              </div>
              <Text
                strong
                style={{
                  display: "block",
                  marginTop: "24px",
                  fontSize: "16px",
                  color: recordingState === "recording" ? "#ef4444" : "#64748b",
                }}
              >
                {recordingState === "recording"
                  ? `Recording... ${formatTime(timer)}`
                  : "Click to answer"}
              </Text>
              {transcript && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "12px",
                    maxWidth: "600px",
                    margin: "20px auto",
                  }}
                >
                  <Text italic style={{ fontSize: "14px", color: "#324563" }}>
                    {transcript}
                  </Text>
                </div>
              )}
            </div>
          </Card>

          <div style={{ textAlign: "center" }}>
            <Button
              size="large"
              onClick={handleNextQuestion}
              disabled={!transcript.trim()}
            >
              Next Question
            </Button>
          </div>
        </div>
      );
    }

    if (examPhase === "part2-prep") {
      return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Tag
            color="green"
            style={{
              fontSize: "14px",
              padding: "4px 16px",
              marginBottom: "24px",
            }}
          >
            Part 2: Preparation Time
          </Tag>

          <Card
            style={{
              borderRadius: "24px",
              padding: "40px",
              marginBottom: "24px",
            }}
          >
            <Title level={3} style={{ marginBottom: "24px" }}>
              {selectedTest.part2.cueCard}
            </Title>
            <Paragraph
              strong
              style={{ fontSize: "16px", marginBottom: "16px" }}
            >
              You should say:
            </Paragraph>
            <ul style={{ fontSize: "16px", lineHeight: "2" }}>
              {selectedTest.part2.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
            <Divider />
            <div style={{ textAlign: "center" }}>
              <Title
                level={1}
                style={{ color: "#6B46C1", fontSize: "72px", margin: "20px 0" }}
              >
                {Math.max(0, 60 - timer)}
              </Title>
              <Text type="secondary" style={{ fontSize: "18px" }}>
                seconds remaining to prepare
              </Text>
              <Paragraph type="secondary" style={{ marginTop: "16px" }}>
                Take notes and prepare your answer. You will have 2 minutes to
                speak.
              </Paragraph>
            </div>
          </Card>

          <div style={{ textAlign: "center" }}>
            <Button size="large" type="primary" onClick={handleNextQuestion}>
              Start Speaking
            </Button>
          </div>
        </div>
      );
    }

    if (examPhase === "part2-speak") {
      const timeLimit = 120;
      const timeRemaining = Math.max(0, timeLimit - timer);

      return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Tag
            color="green"
            style={{
              fontSize: "14px",
              padding: "4px 16px",
              marginBottom: "24px",
            }}
          >
            Part 2: Speaking
          </Tag>

          <Card
            style={{
              borderRadius: "32px",
              padding: "40px",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <Title level={4} style={{ marginBottom: "32px" }}>
              {selectedTest.part2.cueCard}
            </Title>

            <div style={{ marginBottom: "32px" }}>
              <Title
                level={1}
                style={{
                  color: timer >= timeLimit ? "#ef4444" : "#6B46C1",
                  fontSize: "64px",
                  margin: 0,
                }}
              >
                {formatTime(timeRemaining)}
              </Title>
              <Text type="secondary">Time remaining</Text>
            </div>

            <div
              className={
                recordingState === "recording" ? "recording-indicator" : ""
              }
              style={{ width: "120px", height: "120px", margin: "0 auto" }}
            >
              <Button
                onClick={() =>
                  recordingState === "idle" ? startRecording() : stopRecording()
                }
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  backgroundColor:
                    recordingState === "recording" ? "#ef4444" : "#6B46C1",
                  color: "white",
                  border: "none",
                }}
              >
                {recordingState === "recording" ? (
                  <MicOff size={48} />
                ) : (
                  <Mic size={48} />
                )}
              </Button>
            </div>
            <Text
              strong
              style={{ display: "block", marginTop: "24px", fontSize: "16px" }}
            >
              {recordingState === "recording"
                ? "Recording..."
                : "Click to start speaking"}
            </Text>
          </Card>

          <div style={{ textAlign: "center" }}>
            <Button
              size="large"
              onClick={handleNextQuestion}
              disabled={!transcript.trim()}
            >
              Finish Part 2
            </Button>
          </div>
        </div>
      );
    }

    if (examPhase === "part3") {
      const currentQuestion =
        selectedTest.part3.questions[currentQuestionIndex];
      const progress =
        ((currentQuestionIndex + 1) / selectedTest.part3.questions.length) *
        100;

      return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tag
              color="purple"
              style={{ fontSize: "14px", padding: "4px 16px" }}
            >
              Part 3: {selectedTest.part3.topic}
            </Tag>
            <Text type="secondary">
              Question {currentQuestionIndex + 1} of{" "}
              {selectedTest.part3.questions.length}
            </Text>
          </div>
          <Progress
            percent={Math.round(progress)}
            showInfo={false}
            strokeColor="#a855f7"
            style={{ marginBottom: "24px" }}
          />

          <Card
            style={{
              borderRadius: "32px",
              padding: "60px 20px",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <Avatar
              size={120}
              icon={<User size={60} />}
              style={{
                backgroundColor: "#faf5ff",
                color: "#a855f7",
                marginBottom: "32px",
              }}
            />
            <Title
              level={3}
              style={{
                minHeight: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              "{currentQuestion}"
            </Title>

            <div style={{ marginTop: "40px" }}>
              <div
                className={
                  recordingState === "recording" ? "recording-indicator" : ""
                }
                style={{ width: "120px", height: "120px", margin: "0 auto" }}
              >
                <Button
                  onClick={() =>
                    recordingState === "idle"
                      ? startRecording()
                      : stopRecording()
                  }
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor:
                      recordingState === "recording" ? "#ef4444" : "#a855f7",
                    color: "white",
                    border: "none",
                  }}
                >
                  {recordingState === "recording" ? (
                    <MicOff size={48} />
                  ) : (
                    <Mic size={48} />
                  )}
                </Button>
              </div>
              <Text
                strong
                style={{
                  display: "block",
                  marginTop: "24px",
                  fontSize: "16px",
                  color: recordingState === "recording" ? "#ef4444" : "#64748b",
                }}
              >
                {recordingState === "recording"
                  ? `Recording... ${formatTime(timer)}`
                  : "Click to answer"}
              </Text>
              {transcript && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "16px",
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "12px",
                    maxWidth: "600px",
                    margin: "20px auto",
                  }}
                >
                  <Text italic style={{ fontSize: "14px", color: "#324563" }}>
                    {transcript}
                  </Text>
                </div>
              )}
            </div>
          </Card>

          <div style={{ textAlign: "center" }}>
            <Button
              size="large"
              onClick={handleNextQuestion}
              disabled={!transcript.trim()}
            >
              {currentQuestionIndex < selectedTest.part3.questions.length - 1
                ? "Next Question"
                : "Finish Test"}
            </Button>
          </div>
        </div>
      );
    }

    if (examPhase === "complete") {
      if (isAnalyzing) {
        return (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
              padding: "100px 20px",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🤖</div>
            <Title level={3}>Analyzing Your Performance...</Title>
            <Paragraph type="secondary">
              Our AI examiner is reviewing your answers and preparing detailed
              feedback.
            </Paragraph>
            <Progress
              percent={100}
              status="active"
              showInfo={false}
              strokeColor="#6B46C1"
              style={{ marginTop: "32px" }}
            />
          </div>
        );
      }

      if (!finalAnalysis) {
        return (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
              padding: "100px 20px",
            }}
          >
            <AlertCircle
              size={64}
              color="#ef4444"
              style={{ marginBottom: "24px" }}
            />
            <Title level={3}>Analysis Failed</Title>
            <Paragraph>
              Please check your API key configuration and try again.
            </Paragraph>
            <Button onClick={() => setPageState("listing")}>
              Back to Tests
            </Button>
          </div>
        );
      }

      return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Button
            icon={<ArrowLeft size={18} />}
            onClick={() => setPageState("listing")}
            style={{ marginBottom: "24px" }}
          >
            Back to Tests
          </Button>

          <Card
            style={{
              borderRadius: "32px",
              padding: "40px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "40px",
                backgroundColor: "#f3e8ff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                transform: "rotate(5deg)",
              }}
            >
              <Award size={32} color="#6B46C1" />
              <Title
                level={1}
                style={{ margin: 0, color: "#6B46C1", fontSize: "56px" }}
              >
                {finalAnalysis.overall_band}
              </Title>
              <Text
                strong
                style={{
                  fontSize: "10px",
                  color: "#6B46C1",
                  letterSpacing: "1px",
                }}
              >
                OVERALL BAND
              </Text>
            </div>
            <Title level={2}>Test Complete!</Title>
            <Text type="secondary">
              Here's your comprehensive IELTS Speaking assessment
            </Text>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card
                title="Band Scores Breakdown"
                style={{ borderRadius: "24px", height: "100%" }}
              >
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  {[
                    {
                      label: "Fluency & Coherence",
                      score: finalAnalysis.fluency_coherence,
                      color: "#f6c34a",
                    },
                    {
                      label: "Lexical Resource",
                      score: finalAnalysis.lexical_resource,
                      color: "#f0b429",
                    },
                    {
                      label: "Grammatical Range",
                      score: finalAnalysis.grammatical_range,
                      color: "#f59e0b",
                    },
                    {
                      label: "Pronunciation",
                      score: finalAnalysis.pronunciation,
                      color: "#ef4444",
                    },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Text strong>{item.label}</Text>
                        <Text strong style={{ color: item.color }}>
                          {item.score}
                        </Text>
                      </div>
                      <Progress
                        percent={(item.score / 9) * 100}
                        showInfo={false}
                        strokeColor={item.color}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title="Key Strengths"
                style={{
                  borderRadius: "24px",
                  height: "100%",
                  backgroundColor: "#fdf8ec",
                }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {finalAnalysis?.strengths?.map(
                    (strength: string, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: "12px" }}>
                        <CheckCircle
                          size={20}
                          color="#22c55e"
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                        <Text>{strength}</Text>
                      </div>
                    ),
                  ) || (
                    <Text type="secondary">No strengths data available</Text>
                  )}
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title="Areas for Improvement"
                style={{
                  borderRadius: "24px",
                  height: "100%",
                  backgroundColor: "#fff7ed",
                }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {finalAnalysis?.weaknesses?.map(
                    (weakness: string, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: "12px" }}>
                        <AlertCircle
                          size={20}
                          color="#f59e0b"
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                        <Text>{weakness}</Text>
                      </div>
                    ),
                  ) || (
                    <Text type="secondary">No weaknesses data available</Text>
                  )}
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title="Vocabulary Suggestions"
                style={{
                  borderRadius: "24px",
                  height: "100%",
                  backgroundColor: "#fdf7ea",
                }}
              >
                <Space wrap size={[8, 12]}>
                  {finalAnalysis.vocabulary_suggestions.map(
                    (word: string, idx: number) => (
                      <Tag
                        key={idx}
                        color="blue"
                        style={{
                          borderRadius: "8px",
                          padding: "4px 12px",
                          fontSize: "13px",
                        }}
                      >
                        {word}
                      </Tag>
                    ),
                  )}
                </Space>
              </Card>
            </Col>

            <Col xs={24}>
              <Card title="Detailed Feedback" style={{ borderRadius: "24px" }}>
                <Paragraph
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#324563",
                  }}
                >
                  {finalAnalysis.detailed_feedback}
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title="Recommendations"
                style={{ borderRadius: "24px", backgroundColor: "#faf5ff" }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {finalAnalysis?.recommendations?.map(
                    (rec: string, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: "12px" }}>
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#a855f7",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {idx + 1}
                        </div>
                        <Text>{rec}</Text>
                      </div>
                    ),
                  ) || (
                    <Text type="secondary">No recommendations available</Text>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Button
              type="primary"
              size="large"
              onClick={() => setPageState("listing")}
            >
              Take Another Test
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ padding: isMobile ? "10px 0" : "20px 0" }}>
      {pageState === "listing" && renderListing()}
      {pageState === "exam" && renderExam()}
    </div>
  );
};

export default SpeakingPageNew;
