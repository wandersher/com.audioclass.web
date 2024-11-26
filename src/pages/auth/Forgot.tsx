import { Button, Card, Flex, Form, Input, message } from "antd";
import { useState } from "react";
import Icons from "../../components/Icons";

import logo from "../../assets/logo.svg";
import { useFirebase } from "../../libs/firebase";
import { useNavigate } from "react-router-dom";

export function Forgot() {
  const navigate = useNavigate();
  const { reset } = useFirebase();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      if (loading) return;
      setLoading(true);
      message.loading("Надсилання електронного листа...");
      await reset(email);
      message.destroy();
      message.success("Електронний лист для скидання паролю надіслано");
      navigate(-1);
    } catch (error) {
      message.destroy();
      message.error("Помилка надсилання електронного листа для скидання паролю");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{ position: "relative", height: "100vh", background: "linear-gradient(135deg, #9780e5 ,#9780e5 30%, #e666cc 70%, #e666cc)" }}
    >
      <Card
        bordered={false}
        style={{ width: 400 }}
        title={
          <Flex justify="center" align="center" style={{ padding: 16 }}>
            <img src={logo} style={{ height: "100%", width: 200 }} />
          </Flex>
        }
      >
        <Form name="forgot" initialValues={{ remember: true }} style={{ maxWidth: 360 }} onFinish={onSubmit}>
          <Flex vertical justify="space-between">
            <Form.Item name="email" rules={[{ required: true, message: "Будьласка введіть електронну пошту користувача" }]}>
              <Input prefix={<Icons.User size={16} style={{ marginRight: 8 }} />} placeholder="Електронна пошта" size="large" />
            </Form.Item>
            <Button block type="primary" htmlType="submit" size="large" style={{ marginBottom: 16 }} loading={loading}>
              Відновити пароль
            </Button>
            <Button block type="default" htmlType="button" size="large" onClick={() => navigate(-1)}>
              Скасувати
            </Button>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
}
