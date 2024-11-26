import { Button, Card, Flex, Form, Input, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../../components/Icons";

import logo from "../../assets/logo.svg";
import { useFirebase } from "../../libs/firebase";

export function Signin() {
  const { signin } = useFirebase();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    try {
      if (loading) return;
      setLoading(true);
      message.loading("Авторизація...");
      await signin(email, password);
      message.destroy();
      message.success("Авторизація завершена успішно");
    } catch (error) {
      message.destroy();
      message.error("Помилка aвторизації");
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
        <Form name="signin" initialValues={{}} style={{ maxWidth: 360 }} onFinish={onSubmit}>
          <Flex vertical justify="space-between" align="center">
            <Flex vertical style={{ width: "100%" }}>
              <Form.Item name="email" rules={[{ required: true, message: "Будьласка введіть електронну пошту користувача" }]}>
                <Input prefix={<Icons.Email size={16} style={{ marginRight: 8 }} />} placeholder="Електронна пошта" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Будьласка введіть пароль" },
                  { min: 6, message: "Пароль повинен містити від 6 символів" },
                ]}
              >
                <Input.Password prefix={<Icons.Key size={16} style={{ marginRight: 8 }} />} placeholder="Пароль" type="password" size="large" />
              </Form.Item>
              <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Link to="/forgot">Забули пароль</Link>
                <Link to="/signup">Реєстрація</Link>
              </Flex>
            </Flex>
            <Button block type="primary" htmlType="submit" size="large">
              Вхід
            </Button>
            {/* <Flex justify="space-around" align="center" style={{ width: 160, marginTop: 24 }}>
              <HeaderButton last onClick={() => {}}>
                <Icons.Google size={32} />
              </HeaderButton>
              <HeaderButton last onClick={() => {}}>
                <Icons.Apple size={32} />
              </HeaderButton>
            </Flex> */}
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
}
