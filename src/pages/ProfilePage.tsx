import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Tag,
  Statistic,
  Progress,
  Divider,
  Switch,
  Space,
  Input,
  theme,
  message,
  Spin,
  Modal,
  Form,
} from "antd";
import {
  User,
  Mail,
  Target,
  Calendar,
  Settings,
  Bell,
  Lock,
  CreditCard,
  LogOut,
  Camera,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
  clearAuthTokens,
  changePassword,
  type ProfileData,
} from "../services/authService";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  theme.useToken();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm] = Form.useForm();

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [targetScore, setTargetScore] = useState<number | undefined>();
  const [targetDate, setTargetDate] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      setProfile(data);
      const fullName = `${data.first_name} ${data.last_name}`.trim();
      setName(fullName);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setTargetScore(data.target_score);
      setTargetDate(data.target_date || "");
      setEmailNotifications(data.email_notifications || false);
      setTwoFactorEnabled(data.two_factor_enabled || false);
    } catch (error: any) {
      console.error("Failed to load profile:", error);
      message.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const nameParts = name.trim().split(" ");
      const newFirstName = nameParts[0] || firstName;
      const newLastName = nameParts.slice(1).join(" ") || lastName;

      const updatedProfile = await updateUserProfile({
        first_name: newFirstName,
        last_name: newLastName,
        target_score: targetScore,
        target_date: targetDate || undefined,
        email_notifications: emailNotifications,
        two_factor_enabled: twoFactorEnabled,
      });

      setProfile(updatedProfile);
      setFirstName(updatedProfile.first_name);
      setLastName(updatedProfile.last_name);
      message.success("Changes saved successfully!");
    } catch (error: any) {
      console.error("Failed to save changes:", error);
      message.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    message.success("Logged out successfully");
    navigate("/login");
  };

  const handleChangePassword = async (values: any) => {
    try {
      setChangingPassword(true);
      await changePassword(values.new_password);
      message.success("Password changed successfully!");
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error: any) {
      console.error("Failed to change password:", error);
      message.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Text type="secondary">Failed to load profile data</Text>
        <br />
        <Button type="primary" onClick={loadProfile} style={{ marginTop: "16px" }}>
          Retry
        </Button>
      </div>
    );
  }

  const skillProgress = [
    { name: "Listening", score: profile.skills?.listening || 0, maxScore: 9, color: "#3b82f6" },
    { name: "Reading", score: profile.skills?.reading || 0, maxScore: 9, color: "#10b981" },
    { name: "Writing", score: profile.skills?.writing || 0, maxScore: 9, color: "#f59e0b" },
    { name: "Speaking", score: profile.skills?.speaking || 0, maxScore: 9, color: "#ef4444" },
  ];

  const overallScore = profile.skills
    ? ((profile.skills.listening + profile.skills.reading + profile.skills.writing + profile.skills.speaking) / 4).toFixed(1)
    : "0.0";

  const progressPercent = profile.target_score ? (parseFloat(overallScore) / profile.target_score) * 100 : 0;
  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  const membership = profile.is_vip ? "VIP" : "Free";
  const joinedDate = new Date(profile.date_joined).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div style={{ paddingBottom: "60px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: "24px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", textAlign: "center" }}
            bodyStyle={{ padding: "40px 24px" }}
          >
            <div style={{ position: "relative", display: "inline-block", marginBottom: "24px" }}>
              <Avatar
                size={120}
                src={profile.picture}
                icon={!profile.picture && <User size={60} />}
                style={{ backgroundColor: "#f3e8ff", color: "#6B46C1", border: "4px solid #fff", boxShadow: "0 10px 25px rgba(107, 70, 193, 0.1)" }}
              />
              <Button
                type="primary" shape="circle" icon={<Camera size={14} />} size="small"
                style={{ position: "absolute", bottom: 5, right: 5, backgroundColor: "#6B46C1", border: "2px solid #fff" }}
              />
            </div>
            <Title level={3} style={{ margin: "0 0 8px 0" }}>{fullName}</Title>
            <Text type="secondary" style={{ display: "block", marginBottom: "16px" }}>{profile.email}</Text>
            <Tag color="purple" style={{ borderRadius: "20px", padding: "2px 16px", fontWeight: "bold" }}>{membership}</Tag>
            <Divider style={{ margin: "32px 0" }} />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Joined" value={joinedDate} valueStyle={{ fontSize: "14px", fontWeight: "bold" }} />
              </Col>
              <Col span={12}>
                <Statistic title="Status" value="Active" valueStyle={{ fontSize: "14px", fontWeight: "bold", color: "#10b981" }} />
              </Col>
            </Row>
            <Button block danger icon={<LogOut size={16} />} onClick={handleLogout}
              style={{ marginTop: "32px", borderRadius: "12px", height: "48px", fontWeight: "bold" }}>
              Log Out
            </Button>
          </Card>

          <Card title={<Space><Target size={18} color="#6B46C1" /> My IELTS Goals</Space>}
            style={{ borderRadius: "24px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <Text type="secondary" style={{ fontSize: "12px" }}>TARGET SCORE</Text>
                <Title level={2} style={{ margin: 0 }}>{profile.target_score || "N/A"}</Title>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>CURRENT SCORE</Text>
                <Title level={4} style={{ margin: 0 }}>{overallScore}</Title>
              </div>
            </div>
            <Text type="secondary" style={{ display: "block", marginBottom: "8px", fontSize: "13px" }}>Overall Progress</Text>
            <Progress percent={Math.min(progressPercent, 100)} strokeColor="#6B46C1" />
            <Text type="secondary" style={{ display: "block", marginTop: "16px", fontSize: "12px", textAlign: "center" }}>
              {profile.target_score && parseFloat(overallScore) < profile.target_score
                ? `Keep practicing! You are ${(profile.target_score - parseFloat(overallScore)).toFixed(1)} bands away from your goal.`
                : profile.target_score ? "Congratulations! You reached your target!" : "Set a target score to track your progress."}
            </Text>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title={<Space><Settings size={18} color="#6B46C1" /> Account Settings</Space>}
            style={{ borderRadius: "24px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}
            bodyStyle={{ padding: "0 0 24px 0" }}>
            <div style={{ padding: "24px" }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: "block", marginBottom: "8px" }}>Full Name</Text>
                  <Input value={name} onChange={(e) => setName(e.target.value)} prefix={<User size={14} color="#94a3b8" />}
                    style={{ borderRadius: "8px", height: "40px" }} />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: "block", marginBottom: "8px" }}>Email Address</Text>
                  <Input value={email} disabled prefix={<Mail size={14} color="#94a3b8" />}
                    style={{ borderRadius: "8px", height: "40px" }} />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: "block", marginBottom: "8px" }}>Target Band Score</Text>
                  <Input type="number" min={0} max={9} step={0.5} value={targetScore}
                    onChange={(e) => setTargetScore(parseFloat(e.target.value) || undefined)}
                    prefix={<Target size={14} color="#94a3b8" />} style={{ borderRadius: "8px", height: "40px" }} placeholder="7.5" />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong style={{ display: "block", marginBottom: "8px" }}>Target Date</Text>
                  <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
                    prefix={<Calendar size={14} color="#94a3b8" />} style={{ borderRadius: "8px", height: "40px" }} />
                </Col>
              </Row>
              <Button type="primary" loading={saving} onClick={handleSaveChanges}
                style={{ marginTop: "24px", borderRadius: "8px", padding: "0 32px", backgroundColor: "#6B46C1", height: "40px" }}>
                Save Changes
              </Button>
            </div>
            <Divider style={{ margin: 0 }} />
            <div style={{ padding: "24px" }}>
              <Title level={5} style={{ marginBottom: "20px" }}>Security & Notifications</Title>
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space size={12}>
                    <div style={{ backgroundColor: "var(--bg-secondary)", padding: "8px", borderRadius: "8px" }}><Bell size={16} /></div>
                    <div><Text strong style={{ display: "block" }}>Email Notifications</Text><Text type="secondary" style={{ fontSize: "12px" }}>Receive daily practice reminders and tips.</Text></div>
                  </Space>
                  <Switch checked={emailNotifications} onChange={setEmailNotifications} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space size={12}>
                    <div style={{ backgroundColor: "var(--bg-secondary)", padding: "8px", borderRadius: "8px" }}><Lock size={16} /></div>
                    <div><Text strong style={{ display: "block" }}>Two-Factor Authentication</Text><Text type="secondary" style={{ fontSize: "12px" }}>Add an extra layer of security.</Text></div>
                  </Space>
                  <Switch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space size={12}>
                    <div style={{ backgroundColor: "var(--bg-secondary)", padding: "8px", borderRadius: "8px" }}><Lock size={16} /></div>
                    <div><Text strong style={{ display: "block" }}>Change Password</Text><Text type="secondary" style={{ fontSize: "12px" }}>Update your account password.</Text></div>
                  </Space>
                  <Button type="primary" onClick={() => setPasswordModalVisible(true)} style={{ borderRadius: "8px" }}>Change</Button>
                </div>
              </Space>
            </div>
            <Divider style={{ margin: 0 }} />
            <div style={{ padding: "24px" }}>
              <Title level={5} style={{ marginBottom: "20px" }}>Subscription</Title>
              <Card style={{ borderRadius: "8px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Space size={16}>
                    <div style={{ backgroundColor: "#10b981", padding: "10px", borderRadius: "8px" }}><CreditCard size={20} color="white" /></div>
                    <div>
                      <Text strong style={{ display: "block" }}>{membership} Plan</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {profile.is_vip && profile.vip_expires_at
                          ? `Expires: ${new Date(profile.vip_expires_at).toLocaleDateString("en-US")}`
                          : "Currently on free plan"}
                      </Text>
                    </div>
                  </Space>
                  <Button type="link" style={{ color: "#10b981", fontWeight: "bold" }}
                    onClick={() => (window.location.href = "/dashboard/pricing")}>Upgrade</Button>
                </div>
              </Card>
            </div>
          </Card>

          <Card title={<Space><BarChart3 size={18} color="#6B46C1" /> Skill Breakdown</Space>}
            style={{ borderRadius: "24px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", marginTop: "24px" }}>
            <Row gutter={[24, 24]}>
              {skillProgress.map((skill, i) => (
                <Col xs={24} md={12} key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <Text strong>{skill.name}</Text>
                    <Text strong style={{ color: skill.color }}>{skill.score} / {skill.maxScore}</Text>
                  </div>
                  <Progress percent={(skill.score / skill.maxScore) * 100} strokeColor={skill.color} showInfo={false} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => { setPasswordModalVisible(false); passwordForm.resetFields(); }}
        footer={null}
        centered
      >
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: "24px" }}>
          <Form.Item
            name="current_password" label="Current Password"
            rules={[{ required: true, message: "Please enter your current password" }, { min: 1 }]}
          >
            <Input.Password prefix={<Lock size={16} />} placeholder="Current password" style={{ borderRadius: "8px", height: "40px" }} />
          </Form.Item>
          <Form.Item
            name="new_password" label="New Password"
            rules={[{ required: true, message: "Please enter your new password" }, { min: 1 }]}
          >
            <Input.Password prefix={<Lock size={16} />} placeholder="New password" style={{ borderRadius: "8px", height: "40px" }} />
          </Form.Item>
          <Form.Item
            name="new_password_confirm" label="Confirm New Password"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<Lock size={16} />} placeholder="Confirm new password" style={{ borderRadius: "8px", height: "40px" }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => { setPasswordModalVisible(false); passwordForm.resetFields(); }}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={changingPassword} style={{ backgroundColor: "#6B46C1" }}>Save</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;