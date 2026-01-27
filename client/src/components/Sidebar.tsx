import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Layout, Menu, Avatar, Button, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  BankOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Sider } = Layout;
const { Text } = Typography;

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const roles = user.roles || [];

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Boshqaruv paneli",
    },
    roles.includes("ADMIN") && {
      key: "/users",
      icon: <UserOutlined />,
      label: "Foydalanuvchilarni boshqarish",
    },
    roles.includes("PAYMENT") && {
      key: "/payments",
      icon: <DollarOutlined />,
      label: "To'lovlar",
    },
    roles.includes("REPORTS") && {
      key: "/reports",
      icon: <FileTextOutlined />,
      label: "Hisobotlar",
    },
  ].filter(Boolean) as MenuProps["items"];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setLocation(e.key);
  };

  return (
    <Sider
      width={256}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        overflow: "auto",
      }}
      theme="dark"
    >
      <div style={{ padding: "24px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BankOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Text strong style={{ fontSize: 18, color: "#fff" }}>
            Markaziy Bank
          </Text>
        </div>
        <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginLeft: 32 }}>
          Moliyaviy Tizimlar
        </Text>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, marginTop: 8 }}
      />

      <div style={{ 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: 16, 
        borderTop: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Avatar style={{ backgroundColor: "#1890ff" }}>
            {user.firstName[0]}{user.lastName[0]}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong style={{ color: "#fff", display: "block" }} ellipsis>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} ellipsis>
              {user.email}
            </Text>
          </div>
        </div>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={() => logout()}
          block
          style={{ textAlign: "left" }}
        >
          Tizimdan chiqish
        </Button>
      </div>
    </Sider>
  );
}
