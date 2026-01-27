import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUsers, useUserMutations } from "@/hooks/use-users";
import { UserModal } from "@/components/UserModal";
import { useLocation } from "wouter";
import { 
  Table, 
  Button, 
  Card, 
  Input, 
  Tag, 
  Space, 
  Avatar, 
  Typography,
  Modal,
  Result
} from "antd";
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

interface UserRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export default function UsersPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: users, isLoading } = useUsers();
  const { remove } = useUserMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");

  if (user && !user.roles.includes("ADMIN")) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Result
          status="403"
          title="Kirish rad etildi"
          subTitle="Ushbu sahifani ko'rish uchun sizda yetarli ruxsat (ADMIN) mavjud emas."
          extra={
            <Button type="primary" onClick={() => setLocation("/")}>
              Boshqaruv paneliga qaytish
            </Button>
          }
        />
      </div>
    );
  }

  const filteredUsers = users?.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Ishonchingiz komilmi?",
      icon: <ExclamationCircleOutlined />,
      content: "Ushbu amalni bekor qilib bo'lmaydi. Bu foydalanuvchi hisobini butunlay o'chirib tashlaydi.",
      okText: "Foydalanuvchini o'chirish",
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk: async () => {
        await remove.mutate(id);
      },
    });
  };

  const columns: ColumnsType<UserRecord> = [
    {
      title: "Foydalanuvchi",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1890ff" }}>
            {record.firstName[0]}{record.lastName[0]}
          </Avatar>
          <Text strong>{record.firstName} {record.lastName}</Text>
        </Space>
      ),
    },
    {
      title: "Elektron pochta",
      dataIndex: "email",
      key: "email",
      render: (email) => <Text type="secondary">{email}</Text>,
    },
    {
      title: "Rollar",
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) => (
        <Space wrap>
          {roles.map((role) => (
            <Tag 
              key={role} 
              color={
                role === "ADMIN" ? "purple" : 
                role === "PAYMENT" ? "green" : 
                "blue"
              }
            >
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ marginBottom: 4, color: "#001529" }}>
            Foydalanuvchilarni boshqarish
          </Title>
          <Text type="secondary">Tizimga kirish huquqlari va rollarni boshqarish.</Text>
        </div>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />}
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
        >
          Foydalanuvchi yaratish
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text strong style={{ fontSize: 16, color: "#001529" }}>Tizim foydalanuvchilari</Text>
          <Input
            placeholder="Qidirish..."
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Foydalanuvchilar topilmadi." }}
        />
      </Card>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userToEdit={editingUser}
      />
    </div>
  );
}
