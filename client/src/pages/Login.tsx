import { Card, Form, Input, Button, Typography } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/use-auth";

const { Title, Text } = Typography;

interface LoginValues {
  email: string;
  password: string;
}

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values: LoginValues) => {
    login(values);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#f0f2f5",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 384,
        background: "linear-gradient(to bottom, rgba(0,21,41,0.1), transparent)",
        zIndex: 0
      }} />
      
      <Card 
        style={{ 
          width: "100%", 
          maxWidth: 400, 
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          borderTop: "4px solid #1890ff",
          zIndex: 1
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            background: "rgba(24,144,255,0.1)", 
            borderRadius: 12, 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: 16
          }}>
            <SafetyCertificateOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          </div>
          <Title level={3} style={{ marginBottom: 8, color: "#001529" }}>
            Markaziy Bank Tizimi
          </Title>
          <Text type="secondary">
            Moliyaviy tizimga xavfsiz kirish uchun ma'lumotlaringizni kiriting
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Elektron pochta manzili"
            name="email"
            rules={[
              { required: true, message: "Elektron pochta kiritilishi shart" },
              { type: "email", message: "Elektron pochta manzili noto'g'ri" }
            ]}
          >
            <Input size="large" placeholder="nom@bank.uz" />
          </Form.Item>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span>Parol</span>
              <a href="#" style={{ fontSize: 12, color: "#1890ff" }}>Parolni unutdingizmi?</a>
            </div>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Parol kiritilishi shart" }]}
              style={{ marginBottom: 0 }}
            >
              <Input.Password size="large" placeholder="********" />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={isLoggingIn}
            >
              {isLoggingIn ? "Kirilmoqda..." : "Tizimga kirish"}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ 
          textAlign: "center", 
          paddingTop: 16, 
          borderTop: "1px solid #f0f0f0",
          color: "rgba(0,0,0,0.45)",
          fontSize: 12
        }}>
          Xavfsiz hudud. Faqat ruxsat etilgan xodimlar uchun.
        </div>
      </Card>
    </div>
  );
}
