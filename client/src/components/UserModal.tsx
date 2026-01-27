import { useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button, Row, Col, Space } from "antd";
import { useRoles } from "@/hooks/use-roles";
import { useUserMutations } from "@/hooks/use-users";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: any;
}

export function UserModal({ isOpen, onClose, userToEdit }: UserModalProps) {
  const { data: roles } = useRoles();
  const { create, update } = useUserMutations();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        form.setFieldsValue({
          firstName: userToEdit.firstName,
          lastName: userToEdit.lastName,
          email: userToEdit.email,
          password: "unchanged",
          roles: userToEdit.roles,
        });
      } else {
        form.resetFields();
      }
    }
  }, [userToEdit, isOpen, form]);

  const onFinish = async (values: any) => {
    try {
      if (userToEdit) {
        const updateData = { ...values };
        if (values.password === "unchanged") delete updateData.password;
        await update.mutate({ id: userToEdit.id, ...updateData });
      } else {
        await create.mutate(values);
      }
      onClose();
    } catch (error) {
    }
  };

  return (
    <Modal
      title={userToEdit ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi yaratish"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ism"
              name="firstName"
              rules={[{ required: true, message: "Ism kiritilishi shart" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Familiya"
              name="lastName"
              rules={[{ required: true, message: "Familiya kiritilishi shart" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Elektron pochta"
          name="email"
          rules={[
            { required: true, message: "Elektron pochta kiritilishi shart" },
            { type: "email", message: "Elektron pochta formati noto'g'ri" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Parol"
          name="password"
          rules={[{ required: !userToEdit, message: "Parol kiritilishi shart" }]}
        >
          <Input.Password 
            placeholder={userToEdit ? "O'zgartirmaslik uchun bo'sh qoldiring" : ""}
          />
        </Form.Item>

        <Form.Item
          label="Rollar"
          name="roles"
          rules={[{ required: true, message: "Kamida bitta rol tanlanishi shart" }]}
        >
          <Checkbox.Group style={{ width: "100%" }}>
            <Row>
              {roles?.map((role) => (
                <Col span={12} key={role.id}>
                  <Checkbox value={role.name} style={{ marginBottom: 8 }}>
                    {role.name}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginTop: 8 }}>
          <Space style={{ float: "right" }}>
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}
