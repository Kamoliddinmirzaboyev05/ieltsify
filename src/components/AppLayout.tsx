import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Breadcrumb, theme, Button, Drawer } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  PenTool,
  Mic,
  BookOpen,
  CreditCard,
  LifeBuoy,
  User,
  Bell,
  Sun,
  Moon,
  Target,
} from "lucide-react";
import { FiSidebar } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={20} />,
  reports: <FileText size={20} />,
  writing: <PenTool size={20} />,
  speaking: <Mic size={20} />,
  pricing: <CreditCard size={20} />,
  "reading-hub": <BookOpen size={20} />,
  "listening-hub": <Mic size={20} />,
  "mock-exam": <Target size={20} />,
  vocabulary: <BookOpen size={20} />,
  "smart-article": <FileText size={20} />,
  profile: <User size={20} />,
  support: <LifeBuoy size={20} />,
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("ieltsify_sidebar_collapsed");
    return saved ? saved === "1" : false;
  });
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { isDark, toggleTheme } = useTheme();

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        setCollapsed((prev) => {
          const next = !prev;
          localStorage.setItem("ieltsify_sidebar_collapsed", next ? "1" : "0");
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const SIDEBAR_MENU = [
    { key: "home", label: "Dashboard" },
    { key: "reports", label: "My Reports" },
    { key: "reading-hub", label: "Reading" },
    { key: "listening-hub", label: "Listening" },
    { key: "writing", label: "Writing" },
    { key: "speaking", label: "Speaking" },
    { key: "mock-exam", label: "Mock Exam" },
    { key: "vocabulary", label: "Vocabulary" },
    { key: "smart-article", label: "Smart Article" },
    { key: "pricing", label: "Pricing" },
    { key: "profile", label: "Profile" },
  ];

  const menuItems = SIDEBAR_MENU.map((item) => ({
    key: item.key === "home" ? "/dashboard" : `/dashboard/${item.key}`,
    icon: iconMap[item.key] || <FileText size={18} />,
    label: item.label,
  }));

  const currentPath = location.pathname;

  const SidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: token.colorBgContainer,
      }}
    >
      <div
        style={{
          height: 64,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed && !isMobile ? "center" : "flex-start",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        <img
          src="/logo.png"
          alt="IELTSIFY Logo"
          style={{
            height: 32,
            width: "auto",
            maxWidth: collapsed && !isMobile ? 32 : "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 0",
        }}
        className="sidebar-menu-container"
      >
        <Menu
          theme={isDark ? "dark" : "light"}
          mode="inline"
          selectedKeys={[currentPath]}
          items={menuItems.map((item) => ({
            ...item,
            label: (
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {currentPath === item.key && (
                  <motion.div
                    layoutId="sidebar-slider"
                    style={{
                      position: "absolute",
                      left: -24,
                      width: "4px",
                      height: "24px",
                      background: "#10b981",
                      borderRadius: "0 4px 4px 0",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  style={{
                    fontWeight: currentPath === item.key ? 700 : 500,
                    fontSize: 15,
                    letterSpacing: 0.2,
                    color:
                      currentPath === item.key
                        ? "#10b981"
                        : isDark
                          ? "#94a3b8"
                          : "#64748b",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ),
            style: {
              color:
                currentPath === item.key
                  ? "#10b981"
                  : isDark
                    ? "#94a3b8"
                    : "#64748b",
              fontSize: 15,
              margin: "4px 12px",
              borderRadius: "8px",
              width: "calc(100% - 24px)",
            },
          }))}
          onClick={({ key }) => {
            navigate(key);
            setMobileVisible(false);
          }}
          style={{
            borderRight: 0,
            background: "transparent",
          }}
        />
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider */}
      <Sider
        breakpoint="lg"
        collapsedWidth={72}
        collapsed={collapsed}
        collapsible
        trigger={null}
        onBreakpoint={(broken) => {
          setIsMobile(broken);
        }}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
          localStorage.setItem(
            "ieltsify_sidebar_collapsed",
            collapsed ? "1" : "0",
          );
        }}
        theme="light"
        width={260}
        style={{
          borderRight: `1px solid ${token.colorBorder}`,
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          display: isMobile ? "none" : "flex",
          flexDirection: "column",
          background: token.colorBgContainer,
          overflow: "hidden",
        }}
      >
        {SidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={true}
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        width={260}
        styles={{
          body: {
            padding: 0,
            background: token.colorBgContainer,
          },
          header: {
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorder}`,
          },
        }}
      >
        {SidebarContent}
      </Drawer>

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 72 : 260,
          transition: "margin-left 0.2s",
          minHeight: "100vh",
          background: isDark ? "#0f172a" : "#f8fafc",
        }}
      >
        <Header
          style={{
            padding: isMobile ? "0 16px" : "0 24px",
            background: token.colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${token.colorBorder}`,
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {!isMobile && (
              <Button
                type="text"
                icon={<FiSidebar size={20} />}
                onClick={() => {
                  setCollapsed((prev) => {
                    const next = !prev;
                    localStorage.setItem(
                      "ieltsify_sidebar_collapsed",
                      next ? "1" : "0",
                    );
                    return next;
                  });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: token.colorText,
                }}
              />
            )}
            {isMobile && (
              <Button
                type="text"
                icon={<FiSidebar size={20} />}
                onClick={() => setMobileVisible(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: token.colorText,
                }}
              />
            )}
            <div className={isMobile ? "mobile-hide" : ""}>
              <Breadcrumb
                items={(() => {
                  const pathParts = currentPath.split("/").filter(Boolean);
                  if (pathParts.length === 1 && pathParts[0] === "dashboard") {
                    return [{ title: "Overview" }];
                  }
                  if (pathParts.length === 2 && pathParts[0] === "dashboard") {
                    const pageName = pathParts[1]
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ");
                    return [{ title: pageName }];
                  }
                  return [{ title: "Dashboard" }];
                })()}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "12px" : "20px",
            }}
          >
            <div
              className="hidden md:flex items-center border rounded-full px-3 py-1 cursor-pointer transition-colors"
              onClick={() => navigate("/dashboard/pricing")}
              style={{
                marginRight: "8px",
                borderColor: "var(--border-color)",
                background: "var(--bg-secondary)",
              }}
            >
              <img
                src="/coin.png"
                alt="Coin"
                className="w-5 h-5 mr-1.5"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <span className="font-bold text-sm" style={{ color: "#f59e0b" }}>
                --
              </span>
            </div>
            <Button
              type="text"
              icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
              onClick={toggleTheme}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: token.colorText,
              }}
            />
            <Bell
              size={20}
              style={{ cursor: "pointer", color: token.colorText }}
            />
            <Avatar
              icon={<User size={18} />}
              size={36}
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard/profile")}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: isMobile ? "16px" : "24px",
            minHeight: 280,
            background: "transparent",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
