import { useAuth } from "@/hooks/use-auth";
import { useReports } from "@/hooks/use-data";
import { useLocation } from "wouter";
import { Card, Button, Typography, Row, Col, Skeleton, Result, Empty } from "antd";
import { FileTextOutlined, DownloadOutlined, AreaChartOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

const { Title, Text, Paragraph } = Typography;

export default function ReportsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: reports, isLoading } = useReports();

  const downloadPDF = (report: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(0, 21, 41);
    doc.text("Markaziy Bank", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(report.title, 105, 35, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Sana: ${format(new Date(report.generatedAt), 'dd.MM.yyyy HH:mm')}`, 105, 45, { align: "center" });
    doc.text(`Turi: ${report.type}`, 105, 52, { align: "center" });
    
    doc.setDrawColor(24, 144, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const splitText = doc.splitTextToSize(report.content, 170);
    doc.text(splitText, 20, 75);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Ushbu hujjat elektron tarzda yaratilgan va imzo talab qilmaydi.", 105, 280, { align: "center" });
    
    doc.save(`${report.title.replace(/\s+/g, '_')}.pdf`);
  };

  if (user && !user.roles.includes("REPORTS")) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Result
          status="403"
          title="Kirish rad etildi"
          subTitle="Ushbu sahifani ko'rish uchun sizda yetarli ruxsat (REPORTS) mavjud emas."
          extra={
            <Button type="primary" onClick={() => setLocation("/")}>
              Boshqaruv paneliga qaytish
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4, color: "#001529" }}>Moliyaviy hisobotlar</Title>
        <Text type="secondary">Tizim tomonidan yaratilgan hisobotlar va auditlar.</Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          ))
        ) : reports?.length === 0 ? (
          <Col span={24}>
            <Empty description="Hisobotlar topilmadi" />
          </Col>
        ) : (
          reports?.map((report) => (
            <Col xs={24} sm={12} lg={6} key={report.id}>
              <Card
                hoverable
                style={{ borderLeft: "4px solid #1890ff" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ 
                    background: "rgba(24,144,255,0.1)", 
                    padding: 8, 
                    borderRadius: 8 
                  }}>
                    <FileTextOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                  </div>
                  <Text type="secondary" style={{ fontSize: 10, fontFamily: "monospace" }}>
                    {format(new Date(report.generatedAt), 'dd.MM.yy')}
                  </Text>
                </div>
                
                <Title level={5} style={{ marginBottom: 4 }}>{report.title}</Title>
                <Text type="secondary" style={{ 
                  fontSize: 10, 
                  textTransform: "uppercase", 
                  letterSpacing: 1,
                  color: "#1890ff"
                }}>
                  {report.type}
                </Text>
                
                <Paragraph 
                  type="secondary" 
                  ellipsis={{ rows: 2 }} 
                  style={{ marginTop: 12, marginBottom: 16 }}
                >
                  {report.content}
                </Paragraph>
                
                <Button 
                  type="primary" 
                  ghost 
                  block 
                  icon={<DownloadOutlined />}
                  onClick={() => downloadPDF(report)}
                >
                  PDF Yuklab olish
                </Button>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Card style={{ border: "2px dashed #d9d9d9", background: "#fafafa" }}>
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <AreaChartOutlined style={{ fontSize: 64, color: "rgba(0,0,0,0.1)", marginBottom: 16 }} />
          <Title level={4} style={{ color: "#001529", marginBottom: 8 }}>Analitika sharhi</Title>
          <Paragraph type="secondary" style={{ maxWidth: 480, margin: "0 auto" }}>
            Batafsil moliyaviy tahlil va tarixiy ma'lumotlarni vizuallashtirish bu yerda real ish muhitida paydo bo'ladi.
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
