import { useState } from "react";
import Icons from "../../components/Icons";
import List from "../../components/List";
import { Button, Card, Dropdown, Flex, Input, MenuProps, message, Modal, Space, Tag, Tooltip, Typography, Form } from "antd";
import { useFirestore } from "../../libs/firestore";
import { v4 } from "uuid";
import { Link, useLocation } from "react-router-dom";
import Listen from "../../components/Listen";
import { QRCodeSVG } from "qrcode.react";

export function Courses() {
  const location = useLocation();
  console.log(location.pathname);
  const { courses, saveCourse, deleteCourse } = useFirestore();

  const [qr, setQR] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [form] = Form.useForm();

  const onSubmit = async ({ id, ...data }: any) => {
    console.log("ttt", { id: id ?? v4(), ...data });
    await saveCourse({ id: id ?? v4(), ...data });
    message.success(id ? "Курс успішно змінено" : "Курс успішно створено");
    setModal(null);
  };

  const onDelete = (item: any) => {
    Modal.confirm({
      title: "Ви впевнені що бажаєте видалити курс?",
      icon: <Icons.Delete style={{ marginRight: 16 }} />,
      content: "Цю дію не можливо скасувати",
      okText: "Так",
      okType: "danger",
      cancelText: "Скасувати",
      onOk: () => {
        deleteCourse(item)
          .then(() => message.success("Курс успішно видалено"))
          .catch(() => message.error("Помилка видалення курсу"));
      },
    });
  };

  return (
    <Flex vertical style={{ padding: 32, paddingTop: 16 }}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={2}>Курси</Typography.Title>
        <Flex style={{ marginBottom: 15 }}>
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setModal({});
            }}
          >
            Додати
          </Button>
        </Flex>
      </Flex>
      <List
        headers={[
          { key: "position", title: "#", width: 32 },
          { key: "id", title: <Icons.Link size={20} style={{ margin: 2 }} />, width: 32 },
          { key: "audio", title: <Icons.Audio size={20} style={{ margin: 2 }} />, width: 48 },
          { key: "name", title: "Назва", flex: 20 },
          { key: "group", title: "Група", flex: 15 },
          { key: "listeners", title: "Кількість учасників", flex: 15, center: true },
          { key: "topics", title: "Кількість тем", flex: 15, center: true },
          { key: "actions", title: "Дії", width: 32 },
        ]}
        list={courses ?? []}
        render={(item, key, position) => {
          switch (key) {
            case "position":
              return position + 1;
            case "id":
              return (
                <Button type="text" onClick={() => setQR(item.id)} style={{ width: 24, height: 24, padding: 0 }}>
                  <Icons.QR size={24} />
                </Button>
              );
            case "audio":
              return !item.audio ? (
                <Icons.Loading size={24} style={{ animation: `spin 1s linear infinite` }} />
              ) : (
                <Listen
                  url={item.audio}
                  playComponent={({ play }) => (
                    <Button type="text" onClick={play} style={{ width: 24, height: 24, padding: 0 }}>
                      <Icons.Play size={24} />
                    </Button>
                  )}
                  pauseComponent={({ pause }) => (
                    <Button type="text" onClick={pause} style={{ width: 24, height: 24, padding: 0 }}>
                      <Icons.Pause size={24} />
                    </Button>
                  )}
                />
              );
            case "name":
              return <Link to={`${location.pathname}/${item.id}`}>{item.name}</Link>;
            case "topics":
              return item.topics ?? 0;
            case "actions":
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: <Typography.Text>Редагувати</Typography.Text>,
                        key: "edit",
                        icon: <Icons.Edit size={18} />,
                        onClick: () => {
                          form.resetFields();
                          form.setFieldsValue(item);
                          setModal(item);
                        },
                      },
                      {
                        label: <Typography.Text>Видалити</Typography.Text>,
                        key: "delete",
                        icon: <Icons.Delete size={18} color="red" />,
                        onClick: () => onDelete(item),
                      },
                    ],
                  }}
                  trigger={["click"]}
                  arrow
                >
                  <Button type="text" style={{ margin: 0, padding: 0, height: 22, width: 22 }}>
                    <Icons.MoreHorizontal size={22} />
                  </Button>
                </Dropdown>
              );
            default:
              return null;
          }
        }}
      />

      <Modal open={!!modal} title="Додати курс" onCancel={() => setModal(null)} footer={null}>
        <Form form={form} onFinish={onSubmit} style={{ paddingTop: 16 }}>
          <Flex vertical justify="space-between" align="center">
            <Flex vertical style={{ width: "100%" }}>
              <Form.Item name="id" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="name" rules={[{ required: true, message: "Будьласка введіть назву курсу" }]}>
                <Input placeholder="Назва курсу" size="large" />
              </Form.Item>
              <Form.Item name="group" rules={[{ required: false }]}>
                <Input placeholder="Назва групи ( опціонально )" size="large" />
              </Form.Item>
            </Flex>
            <Button block type="primary" htmlType="submit" size="large">
              Зберегти
            </Button>
          </Flex>
        </Form>
      </Modal>

      <Modal
        open={!!qr}
        title="Код приєднання"
        onCancel={() => setQR(null)}
        style={{ maxWidth: "unset" }}
        width={400}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Flex flex={1} justify="center" align="center" style={{ padding: 16 }}>
          {qr ? <QRCodeSVG value={qr} size={250} /> : null}
        </Flex>
      </Modal>
    </Flex>
  );
}
