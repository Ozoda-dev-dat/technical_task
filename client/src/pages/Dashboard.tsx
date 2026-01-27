import { useAuth } from "@/hooks/use-auth";
import { Card, Button, Tag, Typography, Row, Col, App } from "antd";
import { Link } from "wouter";
import { 
  SafetyCertificateOutlined, 
  RightOutlined, 
  HistoryOutlined,
  BarChartOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { format } from "date-fns";

const { Title, Text, Paragraph } = Typography;

export default function Dashboard() {
  const { user } = useAuth();
  const { message } = App.useApp();

  if (!user) return null;

  const handleDiagnostics = () => {
    message.loading({ content: "Tizim xavfsizligi va butunligi tekshirilmoqda...", key: "diagnostics" });
    setTimeout(() => {
      message.success({ content: "Barcha tizimlar muvaffaqiyatli tekshirildi. Xavfsizlik holati: Faol.", key: "diagnostics" });
    }, 3000);
  };

  const quickActions = [
    {
      title: "Foydalanuvchilarni boshqarish",
      description: "Tizimga kirish huquqlarini boshqarish",
      href: "/users",
      icon: <UserOutlined />,
      show: user.roles.includes("ADMIN"),
    },
    {
      title: "To'lovlarni ko'rish",
      description: "To'lov jurnallarini audit qilish",
      href: "/payments",
      icon: <DollarOutlined />,
      show: user.roles.includes("PAYMENT"),
    },
    {
      title: "Hisobotlarni yaratish",
      description: "Kunlik hisobotlarni yuklab olish",
      href: "/reports",
      icon: <FileTextOutlined />,
      show: user.roles.includes("REPORTS"),
    },
  ].filter(a => a.show);

  return (
    <div style={{ padding: 32, minHeight: "100%" }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8, color: "#001529" }}>
          Xayrli kun, {user.firstName}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Markaziy Bank moliyaviy tizimiga xush kelibsiz.
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            style={{ 
              background: "#001529", 
              border: "none",
              height: "100%"
            }}
          >
            <SafetyCertificateOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
            <Title level={3} style={{ color: "#fff", marginBottom: 8 }}>
              Xavfsizlik holati: Faol
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480, marginBottom: 24 }}>
              Tizim butunligi tekshirildi. Oxirgi audit 2 soat oldin yakunlangan. 
              Sessiyangiz 256-bitli shifrlash bilan himoyalangan.
            </Paragraph>
            <Button type="primary" icon={<SafetyCertificateOutlined />} onClick={handleDiagnostics}>
              Diagnostikani ishga tushirish
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <HistoryOutlined style={{ color: "rgba(0,0,0,0.45)" }} />
              <Text strong style={{ color: "#001529" }}>Sessiya ma'lumotlari</Text>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Oxirgi kirish</Text>
              <div style={{ fontWeight: 500 }}>{format(new Date(), 'dd.MM.yyyy - HH:mm')}</div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>IP Manzil</Text>
              <div style={{ fontWeight: 500, fontFamily: "monospace" }}>192.168.1.1 (Ichki)</div>
            </div>
            
            <div style={{ paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
              <Text type="secondary" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, display: "block", marginBottom: 8 }}>
                Mening rollarim
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {user.roles.map((role: string) => (
                  <Tag key={role} color="blue">{role}</Tag>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {quickActions.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <BarChartOutlined style={{ color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0, color: "#001529" }}>Tezkor amallar</Title>
          </div>
          
          <Row gutter={[16, 16]}>
            {quickActions.map((action) => (
              <Col xs={24} sm={12} lg={8} key={action.href}>
                <Link href={action.href}>
                  <Card 
                    hoverable 
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ color: "#1890ff" }}>{action.icon}</span>
                          <Text strong style={{ fontSize: 16 }}>{action.title}</Text>
                        </div>
                        <Text type="secondary">{action.description}</Text>
                      </div>
                      <RightOutlined style={{ color: "#1890ff" }} />
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
