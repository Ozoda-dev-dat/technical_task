import { useAuth } from "@/hooks/use-auth";
import { usePayments } from "@/hooks/use-data";
import { useLocation } from "wouter";
import { Table, Card, Button, Tag, Typography, Row, Col, Statistic, Result } from "antd";
import { DownloadOutlined, DollarOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface PaymentRecord {
  id: number;
  recipient: string;
  date: string;
  currency: string;
  amount: number;
  status: string;
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: payments, isLoading } = usePayments();

  if (user && !user.roles.includes("PAYMENT")) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Result
          status="403"
          title="Kirish rad etildi"
          subTitle="Ushbu sahifani ko'rish uchun sizda yetarli ruxsat (PAYMENT) mavjud emas."
          extra={
            <Button type="primary" onClick={() => setLocation("/")}>
              Boshqaruv paneliga qaytish
            </Button>
          }
        />
      </div>
    );
  }

  const downloadCSV = () => {
    if (!payments) return;
    const headers = ["ID", "Recipient", "Date", "Currency", "Amount", "Status"];
    const rows = payments.map(p => [
      p.id,
      p.recipient,
      format(new Date(p.date), 'dd.MM.yyyy'),
      p.currency,
      p.amount,
      p.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tranzaksiyalar_${format(new Date(), 'dd_MM_yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnsType<PaymentRecord> = [
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={
          status === "COMPLETED" ? "success" :
          status === "PENDING" ? "warning" :
          "error"
        }>
          {status === "COMPLETED" ? "BAJARILDI" : status === "PENDING" ? "KUTILMOQDA" : "RAD ETILDI"}
        </Tag>
      ),
    },
    {
      title: "Qabul qiluvchi",
      dataIndex: "recipient",
      key: "recipient",
      render: (recipient) => <Text strong>{recipient}</Text>,
    },
    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
      render: (date) => <Text type="secondary">{format(new Date(date), 'dd.MM.yyyy')}</Text>,
    },
    {
      title: "Valyuta",
      dataIndex: "currency",
      key: "currency",
      render: (currency) => <Text strong>{currency}</Text>,
    },
    {
      title: "Summa",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount, record) => (
        <Text strong style={{ fontFamily: "monospace" }}>
          {new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: record.currency }).format(amount)}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ marginBottom: 4, color: "#001529" }}>Tranzaksiyalar</Title>
          <Text type="secondary">Oxirgi to'lov faolligini ko'rish va audit qilish.</Text>
        </div>
        <Button 
          icon={<DownloadOutlined />}
          onClick={downloadCSV}
          disabled={!payments || payments.length === 0}
        >
          CSV shaklida yuklash
        </Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card style={{ background: "#001529" }}>
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.7)" }}>Umumiy hajm</span>}
              value={2.4}
              suffix="M $"
              valueStyle={{ color: "#fff" }}
              prefix={<DollarOutlined />}
            />
            <Text style={{ color: "#1890ff", fontSize: 12 }}>+12% o'tgan oydan</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Kutilmoqda"
              value={42}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Tasdiqlashni kutayotgan tranzaksiyalar</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Rad etilgan"
              value={3}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<CloseCircleOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Zudlik bilan e'tibor talab qiladi</Text>
          </Card>
        </Col>
      </Row>

      <Card title={<Text strong style={{ color: "#001529" }}>Oxirgi to'lovlar</Text>}>
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
