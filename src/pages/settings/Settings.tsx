import { Button, Card, Flex, Input, message, Typography, Form } from "antd";
import { useCallback, useMemo } from "react";
import { useFirebase } from "../../libs/firebase";

export function Settings() {
  const { profile, rename } = useFirebase();

  const initial_personal_data = useMemo(() => ({ name: profile?.displayName }), [profile]);
  const onSubmitPersonalData = useCallback(async (values: { name: string }) => {
    try {
      await rename(values.name);
      message.success("Персональні дані змінено");
    } catch (error) {
      message.error("Не вдалось змінити персональні дані");
    }
  }, []);

  return (
    <Flex vertical style={{ padding: 32, paddingTop: 16 }}>
      <Typography.Title level={2}>Налаштування</Typography.Title>
      <Form initialValues={initial_personal_data} onFinish={onSubmitPersonalData} style={{ paddingTop: 16 }}>
        <Card
          style={{ minHeight: 200, boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.09)" }}
          title={
            <Flex flex={1} align="center" justify="space-between">
              <Typography.Text>Персональна інформація</Typography.Text>
              <Flex>
                <Button type="primary" htmlType="submit">
                  Зберегти
                </Button>
              </Flex>
            </Flex>
          }
        >
          <Flex vertical justify="space-between" align="center">
            <Flex vertical style={{ width: "100%" }}>
              <Form.Item name="name" rules={[{ required: true, message: "Будьласка введіть назву курсу" }]}>
                <Input placeholder="Назва теми" size="large" />
              </Form.Item>
            </Flex>
          </Flex>
        </Card>
      </Form>
    </Flex>
  );
}
