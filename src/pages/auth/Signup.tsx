import { Button, Card, Flex, Form, Input, message } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

import Icons from "../../components/Icons";
import logo from "../../assets/logo.svg";
import { useFirebase } from "../../libs/firebase";

export function Signup() {
  const { signup } = useFirebase();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email, password, name }: { name: string; email: string; password: string }) => {
    try {
      if (loading) return;
      setLoading(true);
      message.loading("Реєстрація...");
      await signup(email, password, name);
      message.destroy();
      message.success("Реєстрація завершена успішно");
    } catch (error) {
      message.destroy();
      message.error("Помилка реєстрації");
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
        <Form name="signup" initialValues={{ remember: true }} style={{ maxWidth: 360 }} onFinish={onSubmit}>
          <Flex vertical>
            <Flex vertical style={{ width: "100%" }}>
              <Form.Item name="name" rules={[{ required: true, message: "Будьласка введіть своє повне імʼя" }]}>
                <Input prefix={<Icons.User size={16} style={{ marginRight: 8 }} />} placeholder="Імʼя" size="large" />
              </Form.Item>
              <Form.Item name="email" rules={[{ required: true, message: "Будьласка введіть свою електронну пошту" }]}>
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
              <Form.Item
                name="confirm"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Будьласка введіть підтвердження паролю" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) return Promise.resolve();
                      return Promise.reject(new Error("Підтвердження не співпадає із введеним паролем"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<Icons.Key size={16} style={{ marginRight: 8 }} />}
                  placeholder="Підтвердження паролю"
                  type="password"
                  size="large"
                />
              </Form.Item>
              <Flex justify="center" align="center" style={{ marginBottom: 16 }}>
                <Link to="/signin">Вже є акаунт</Link>
              </Flex>
            </Flex>
            <Button block type="primary" htmlType="submit" size="large" loading={loading}>
              Реєстрація
            </Button>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
}
