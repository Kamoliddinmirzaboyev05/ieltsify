import React, { useState, useEffect } from "react";
import { Typography, Card, Button, message, Modal, Spin } from "antd";
import { Check, Upload as UploadIcon, CreditCard } from "lucide-react";
import { authenticatedFetch } from "../services/authService";

const { Title, Text } = Typography;

interface Plan {
  id: number;
  code: string;
  name: string;
  price_uzs: number;
  duration_days: number;
  included_coins: number;
  is_unlimited_reading: boolean;
  is_unlimited_listening: boolean;
}

interface CoinPack {
  id: number;
  name: string;
  coins: number;
  price_uzs: number;
}

const PAYMENT_CARD = "8600 1234 5678 9012";
const PAYMENT_CARD_HOLDER = "IELTSIFY ADMIN";

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "coins">(
    "subscriptions",
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [coinPacks, setCoinPacks] = useState<CoinPack[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment modal
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    type: "plan" | "coin";
    id: number;
    name: string;
    price: number;
  } | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, packsRes] = await Promise.all([
        authenticatedFetch("/subscription-plans/"),
        authenticatedFetch("/coin-packs/"),
      ]);

      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data.results || []);
      }
      if (packsRes.ok) {
        const data = await packsRes.json();
        setCoinPacks(data.results || []);
      }
    } catch {
      console.error("Failed to load pricing data");
    } finally {
      setLoading(false);
    }
  };

  const openPayment = (
    type: "plan" | "coin",
    id: number,
    name: string,
    price: number,
  ) => {
    setSelectedItem({ type, id, name, price });
    setReceiptFile(null);
    setPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!receiptFile || !selectedItem) {
      message.error("Please upload a payment receipt");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("receipt_image", receiptFile);

      if (selectedItem.type === "plan") {
        formData.append("plan_id", selectedItem.id.toString());
      } else {
        formData.append("coin_pack_id", selectedItem.id.toString());
      }

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "https://api.ieltsfy.uz";
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/subs/submit-payment/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        message.success(
          "To'lov so'rovi yuborildi! Admin tasdiqlashini kuting.",
        );
        setPaymentModal(false);
        setReceiptFile(null);
      } else {
        const errorData = await response.json();
        message.error(errorData.error || "An error occurred");
      }
    } catch {
      message.error("To'lov yuborishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("uz-UZ");
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  const paidPlans = plans.filter((p) => p.price_uzs > 0);

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <Title level={3} style={{ margin: "0 0 6px 0", fontWeight: 700 }}>
          Tariflar
        </Title>
        <Text type="secondary" style={{ fontSize: "13px" }}>
          O'zingizga mos tarifni tanlang
        </Text>
      </div>

      {/* Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "6px",
            padding: "3px",
          }}
        >
          <button
            onClick={() => setActiveTab("subscriptions")}
            style={{
              padding: "8px 20px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor:
                activeTab === "subscriptions"
                  ? "var(--bg-card)"
                  : "transparent",
              color:
                activeTab === "subscriptions"
                  ? "var(--text-primary)"
                  : "#64748b",
              boxShadow:
                activeTab === "subscriptions"
                  ? "0 1px 3px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            Obunalar
          </button>
          <button
            onClick={() => setActiveTab("coins")}
            style={{
              padding: "8px 20px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor:
                activeTab === "coins" ? "var(--bg-card)" : "transparent",
              color: activeTab === "coins" ? "var(--text-primary)" : "#64748b",
              boxShadow:
                activeTab === "coins" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Coin do'koni
          </button>
        </div>
      </div>

      {activeTab === "subscriptions" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: paidPlans.length > 1 ? "1fr 1fr" : "1fr",
            gap: "16px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {paidPlans.map((plan, i) => (
            <Card
              key={plan.id}
              size="small"
              style={{
                borderRadius: "8px",
                border:
                  i === 1
                    ? "2px solid #f0b429"
                    : "1px solid var(--border-color)",
                position: "relative",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              {i === 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#f0b429",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: "4px",
                  }}
                >
                  TAVSIYA
                </div>
              )}
              <Text
                strong
                style={{
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {plan.name}
              </Text>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "24px", fontWeight: 800 }}>
                  {formatPrice(plan.price_uzs)}
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {" "}
                  UZS / {plan.duration_days} kun
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                  }}
                >
                  <Check size={14} color="#f0b429" /> Cheksiz Reading/Listening
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                  }}
                >
                  <Check size={14} color="#f0b429" /> {plan.included_coins} Coin
                  bonus
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                  }}
                >
                  <Check size={14} color="#f0b429" /> AI baholash
                </div>
              </div>
              <Button
                type="primary"
                block
                onClick={() =>
                  openPayment("plan", plan.id, plan.name, plan.price_uzs)
                }
                style={{
                  borderRadius: "6px",
                  height: "36px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "#f0b429",
                  border: "none",
                }}
              >
                Sotib olish
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "12px",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {coinPacks.map((pack) => (
            <Card
              key={pack.id}
              size="small"
              style={{
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                textAlign: "center",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <img
                src="/coin.png"
                alt="coin"
                style={{ width: "40px", height: "40px", margin: "0 auto 8px" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <Text strong style={{ fontSize: "18px", display: "block" }}>
                {pack.coins} Coin
              </Text>
              <Text
                type="secondary"
                style={{
                  fontSize: "11px",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                ~{Math.floor(pack.coins / 10)} Writing baholash
              </Text>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                {formatPrice(pack.price_uzs)} UZS
              </div>
              <Button
                type="primary"
                block
                size="small"
                onClick={() =>
                  openPayment("coin", pack.id, pack.name, pack.price_uzs)
                }
                style={{
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "#f0b429",
                  border: "none",
                }}
              >
                Sotib olish
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <Modal
        open={paymentModal}
        onCancel={() => setPaymentModal(false)}
        footer={null}
        title={null}
        centered
        width={420}
      >
        <div style={{ padding: "8px 0" }}>
          <Title level={5} style={{ margin: "0 0 4px 0" }}>
            To'lov
          </Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {selectedItem?.name} — {formatPrice(selectedItem?.price || 0)} UZS
          </Text>

          {/* Payment Info Card */}
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <CreditCard size={18} color="#f0b429" />
              <Text strong style={{ fontSize: "13px" }}>
                To'lov ma'lumotlari
              </Text>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Karta raqami:
              </Text>
              <Text strong style={{ fontSize: "16px", letterSpacing: "1px" }}>
                {PAYMENT_CARD}
              </Text>
            </div>
            <div>
              <Text
                type="secondary"
                style={{ fontSize: "11px", display: "block" }}
              >
                Karta egasi:
              </Text>
              <Text strong style={{ fontSize: "13px" }}>
                {PAYMENT_CARD_HOLDER}
              </Text>
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "8px",
                backgroundColor: "#fef3c7",
                borderRadius: "4px",
              }}
            >
              <Text style={{ fontSize: "11px", color: "#92400e" }}>
                Yuqoridagi kartaga {formatPrice(selectedItem?.price || 0)} UZS
                o'tkazing va chekni yuklang
              </Text>
            </div>
          </div>

          {/* Upload Receipt */}
          <div style={{ marginTop: "16px" }}>
            <Text
              strong
              style={{
                fontSize: "12px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              To'lov cheki (screenshot yoki PDF)
            </Text>
            <div
              style={{
                border: "2px dashed var(--border-color)",
                borderRadius: "6px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: receiptFile ? "#fdf8ec" : "#fafafa",
              }}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                style={{ display: "none" }}
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" style={{ cursor: "pointer" }}>
                {receiptFile ? (
                  <div>
                    <Check
                      size={24}
                      color="#f0b429"
                      style={{ margin: "0 auto 6px" }}
                    />
                    <Text style={{ fontSize: "12px", color: "#16a34a" }}>
                      {receiptFile.name}
                    </Text>
                  </div>
                ) : (
                  <div>
                    <UploadIcon
                      size={24}
                      color="#94a3b8"
                      style={{ margin: "0 auto 6px" }}
                    />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Chekni yuklash uchun bosing
                    </Text>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="primary"
            block
            loading={submitting}
            disabled={!receiptFile}
            onClick={submitPayment}
            style={{
              marginTop: "16px",
              borderRadius: "6px",
              height: "40px",
              fontWeight: 600,
              backgroundColor: "#f0b429",
              border: "none",
            }}
          >
            To'lovni yuborish
          </Button>
          <Text
            type="secondary"
            style={{
              fontSize: "11px",
              display: "block",
              textAlign: "center",
              marginTop: "8px",
            }}
          >
            Admin 24 soat ichida tasdiqlaydi
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default PricingPage;
