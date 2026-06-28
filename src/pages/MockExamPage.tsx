import React, { useState, useEffect } from "react";
import { Typography, Card, Button, message, Modal, Row, Col } from "antd";
import { Target, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../services/authService";

const { Title, Text } = Typography;

interface MockExam {
  id: number;
  title: string;
  description: string;
  exam_type: string;
  mock_type: string;
  difficulty: string;
  estimated_duration_minutes: number;
}

interface AccessStatus {
  subscription_active: boolean;
  quota: {
    core: { total: number; used: number; remaining: number };
    complete: { total: number; used: number; remaining: number };
  };
  coin_costs: { core_mock: number; complete_mock: number };
  coin_balance: number;
  last_attempt: {
    mock_type: string;
    overall_band: number;
    completed_at: string;
  } | null;
}

const MockExamPage: React.FC = () => {
  const navigate = useNavigate();
  const [mocks, setMocks] = useState<MockExam[]>([]);
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    mock: MockExam | null;
    accessSource: string;
  }>({ open: false, mock: null, accessSource: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mocksRes, statusRes] = await Promise.all([
        authenticatedFetch("/mock-exams/"),
        authenticatedFetch("/mock-exams/access-status/"),
      ]);

      if (mocksRes.ok) {
        const d = await mocksRes.json();
        setMocks(d.data || []);
      }
      if (statusRes.ok) {
        const d = await statusRes.json();
        setAccessStatus(d.data);
      }
    } catch {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartMock = (mock: MockExam) => {
    if (!accessStatus) return;

    const quota =
      mock.mock_type === "core"
        ? accessStatus.quota.core
        : accessStatus.quota.complete;
    const accessSource =
      quota.remaining > 0 ? "subscription_quota" : "coin_purchase";

    setConfirmModal({ open: true, mock, accessSource });
  };

  const confirmStart = async () => {
    if (!confirmModal.mock) return;
    setStarting(true);

    try {
      const response = await authenticatedFetch(
        `/mock-exams/${confirmModal.mock.id}/start/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_source: confirmModal.accessSource }),
        },
      );

      if (response.ok) {
        await response.json();
        message.success("Mock Exam boshlandi!");
        setConfirmModal({ open: false, mock: null, accessSource: "" });
        // TODO: Navigate to exam mode
        navigate("/dashboard");
      } else {
        const err = await response.json();
        message.error(err.error || err.message || "An error occurred");
      }
    } catch {
      message.error("An error occurred");
    } finally {
      setStarting(false);
    }
  };

  const getQuotaInfo = (mockType: string) => {
    if (!accessStatus) return null;
    const quota =
      mockType === "core"
        ? accessStatus.quota.core
        : accessStatus.quota.complete;
    const coinCost =
      mockType === "core"
        ? accessStatus.coin_costs.core_mock
        : accessStatus.coin_costs.complete_mock;

    if (quota.remaining > 0) {
      return {
        type: "quota",
        text: `Tarifda: ${quota.remaining} ta qoldi`,
        canStart: true,
      };
    }
    if (accessStatus.coin_balance >= coinCost) {
      return {
        type: "coin",
        text: `${coinCost} coin sarflanadi`,
        canStart: true,
      };
    }
    return {
      type: "locked",
      text: `${coinCost} coin kerak (sizda: ${accessStatus.coin_balance})`,
      canStart: false,
    };
  };

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <div
          style={{
            height: "24px",
            width: "200px",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        />
        <div
          style={{
            height: "150px",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={4} style={{ margin: "0 0 4px 0", fontWeight: 700 }}>
          <Target
            size={22}
            style={{
              marginRight: "8px",
              verticalAlign: "middle",
              color: "#f0b429",
            }}
          />
          Full Mock Exam
        </Title>
        <Text type="secondary" style={{ fontSize: "13px" }}>
          Haqiqiy IELTS imtihon muhitida o'zingizni sinab ko'ring
        </Text>
      </div>

      {/* Access Status */}
      {accessStatus && (
        <Card
          size="small"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
            marginBottom: "20px",
          }}
          bodyStyle={{ padding: "14px" }}
        >
          <Row gutter={[12, 8]}>
            <Col xs={12} md={6}>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Core Mock
              </Text>
              <Text strong style={{ fontSize: "14px" }}>
                {accessStatus.quota.core.remaining} /{" "}
                {accessStatus.quota.core.total}
              </Text>
            </Col>
            <Col xs={12} md={6}>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Complete Mock
              </Text>
              <Text strong style={{ fontSize: "14px" }}>
                {accessStatus.quota.complete.remaining} /{" "}
                {accessStatus.quota.complete.total}
              </Text>
            </Col>
            <Col xs={12} md={6}>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Coin balans
              </Text>
              <Text strong style={{ fontSize: "14px", color: "#f59e0b" }}>
                {accessStatus.coin_balance}
              </Text>
            </Col>
            <Col xs={12} md={6}>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Oxirgi natija
              </Text>
              <Text strong style={{ fontSize: "14px" }}>
                {accessStatus.last_attempt
                  ? `Band ${accessStatus.last_attempt.overall_band}`
                  : "—"}
              </Text>
            </Col>
          </Row>
        </Card>
      )}

      {/* Mock Exams List */}
      {mocks.length === 0 ? (
        <Card
          size="small"
          style={{
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <Target size={40} color="#94a3b8" style={{ marginBottom: "12px" }} />
          <Title level={5} style={{ margin: "0 0 4px 0" }}>
            No mock tests available yet
          </Title>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            Admin tomonidan mock testlar qo'shilganda bu yerda ko'rinadi
          </Text>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mocks.map((mock) => {
            const quotaInfo = getQuotaInfo(mock.mock_type);
            return (
              <Card
                key={mock.id}
                size="small"
                style={{
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                }}
                bodyStyle={{ padding: "16px" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(240, 180, 41, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Target size={22} color="#f0b429" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: "14px", display: "block" }}>
                      {mock.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {mock.description}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Clock size={12} /> {mock.estimated_duration_minutes}{" "}
                        daqiqa
                      </span>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        {mock.mock_type === "core"
                          ? "Listening + Reading + Writing"
                          : "Listening + Reading + Writing + Speaking"}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {quotaInfo && (
                      <Text
                        style={{
                          fontSize: "11px",
                          color:
                            quotaInfo.type === "locked" ? "#ef4444" : "#f0b429",
                          display: "block",
                          marginBottom: "6px",
                        }}
                      >
                        {quotaInfo.text}
                      </Text>
                    )}
                    <Button
                      type="primary"
                      size="small"
                      disabled={!quotaInfo?.canStart}
                      onClick={() => handleStartMock(mock)}
                      style={{
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: "#f0b429",
                        border: "none",
                      }}
                    >
                      Boshlash
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirm Modal */}
      <Modal
        open={confirmModal.open}
        onCancel={() =>
          setConfirmModal({ open: false, mock: null, accessSource: "" })
        }
        footer={null}
        centered
        width={380}
      >
        {confirmModal.mock && (
          <div style={{ padding: "8px 0" }}>
            <Title level={5} style={{ margin: "0 0 12px 0" }}>
              Mock Exam boshlash
            </Title>
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Text strong style={{ display: "block", marginBottom: "4px" }}>
                {confirmModal.mock.title}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {confirmModal.mock.mock_type === "core"
                  ? "Listening + Reading + Writing"
                  : "To'liq imtihon (+ Speaking)"}
              </Text>
            </div>

            {confirmModal.accessSource === "coin_purchase" && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                }}
              >
                <Text style={{ fontSize: "12px", color: "#f59e0b" }}>
                  <AlertCircle
                    size={14}
                    style={{ marginRight: "4px", verticalAlign: "middle" }}
                  />
                  {confirmModal.mock.mock_type === "core"
                    ? accessStatus?.coin_costs.core_mock
                    : accessStatus?.coin_costs.complete_mock}{" "}
                  coin sarflanadi
                </Text>
              </div>
            )}

            <div style={{ marginBottom: "12px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "12px", lineHeight: 1.6 }}
              >
                • Timer avtomatik ishlaydi
                <br />
                • Listening audiosi qayta tinglanmaydi
                <br />• Natijalar yakunda ko'rsatiladi
              </Text>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                block
                onClick={() =>
                  setConfirmModal({ open: false, mock: null, accessSource: "" })
                }
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                block
                loading={starting}
                onClick={confirmStart}
                style={{
                  backgroundColor: "#f0b429",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Boshlash
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MockExamPage;
