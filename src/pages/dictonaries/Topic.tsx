import { useEffect, useMemo, useState } from "react";
import Icons from "../../components/Icons";
import List from "../../components/List";
import { Button, Card, Dropdown, Flex, Input, MenuProps, message, Modal, Space, Tag, Tooltip, Typography, Form } from "antd";
import { useFirestore } from "../../libs/firestore";
import { v4 } from "uuid";
import { Link, useLocation, useParams } from "react-router-dom";
import { Loading } from "../Loading";
import Listen from "../../components/Listen";

export function Topic() {
  const { id } = useParams();
  const { topics, saveTopic, exercises, saveExercise, deleteExercise } = useFirestore();

  const topic = useMemo(() => topics?.find((it) => it.id === id), [id, topics]);
  const list = useMemo(() => exercises?.filter((it) => it.topic_id == id).sort((a, b) => (a.position > b.position ? 1 : -1)), [id, exercises]);

  const [modal, setModal] = useState<any>(null);
  const [form] = Form.useForm();

  const onSubmit = async ({ id, ...data }: any) => {
    await saveTopic({ id, ...data });
    message.success("Тему успішно змінено");
  };

  const onSubmitExercise = async ({ id, ...data }: any) => {
    // console.log({ id, ...data });
    await saveExercise({ id: id ?? v4(), ...data, audio: "" });
    message.success(id ? "Завдання успішно змінено" : "Завдання успішно створено");
    setModal(null);
    form.resetFields();
  };
  const onDelete = (item: any) => {
    Modal.confirm({
      title: "Ви впевнені що бажаєте видалити завдання?",
      icon: <Icons.Delete style={{ marginRight: 16 }} />,
      content: "Цю дію не можливо скасувати",
      okText: "Так",
      okType: "danger",
      cancelText: "Скасувати",
      width: 500,
      onOk: () => {
        deleteExercise(item)
          .then(() => message.success("Курс успішно видалено"))
          .catch(() => message.error("Помилка видалення курсу"));
      },
    });
  };

  if (!topic || !list) return <Loading />;

  return (
    <Flex vertical style={{ padding: 32, paddingTop: 16 }}>
      <Typography.Title level={3}>Тема</Typography.Title>
      <Form initialValues={topic} onFinish={onSubmit} style={{ marginBottom: 16 }}>
        <Form.Item name="id" noStyle>
          <Input hidden />
        </Form.Item>
        <Form.Item name="course_id" noStyle>
          <Input hidden />
        </Form.Item>
        <Flex justify="space-between" align="flex-start">
          <Flex flex={5} style={{ marginRight: 24 }}>
            <Form.Item name="name" rules={[{ required: true, message: "Назва теми обовʼязкова" }]} style={{ width: "100%" }}>
              <Input placeholder="Назва теми" size="large" />
            </Form.Item>
          </Flex>
          <Flex vertical justify="flex-start">
            <Button block type="primary" htmlType="submit" size="large">
              Зберегти
            </Button>
          </Flex>
        </Flex>
        <Form.Item name="text" rules={[{ required: false }]}>
          <Input.TextArea placeholder="Текст теми" size="large" style={{ minHeight: 300 }} />
        </Form.Item>
      </Form>
      <Flex justify="space-between" align="center">
        <Typography.Title level={3}>Завдання</Typography.Title>
        <Flex style={{ marginBottom: 15 }}>
          <Button
            type="primary"
            onClick={() => {
              const position = list ? (list.at(list.length - 1)?.position ?? 0) + 1 : 0;
              const item = {
                id: undefined,
                course_id: topic.course_id,
                topic_id: topic.id,
                position,
                text: "",
              };
              setModal(item);
              form.setFieldsValue(item);
              console.log("create", item);
            }}
            size="large"
          >
            Додати завдання
          </Button>
        </Flex>
      </Flex>
      <List
        headers={[
          { key: "position", title: "#", width: 32 },
          { key: "audio", title: <Icons.Audio size={20} style={{ margin: 2 }} />, width: 48 },
          { key: "text", title: "Текст завдання", flex: 20 },
          { key: "actions", title: "Дії", width: 32 },
        ]}
        list={list ?? []}
        render={(item, key) => {
          switch (key) {
            case "position":
              return item.position;
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
            case "text":
              if ((item.text?.length ?? 0) > 150) {
                return (
                  <Tooltip placement="bottom" title={item.text} arrow style={{ maxWidth: "600px" }}>
                    <Typography.Text style={{}}>{item.text.slice(0, 150)}</Typography.Text>
                  </Tooltip>
                );
              } else {
                return <Typography.Text>{item.text}</Typography.Text>;
              }
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
                          setModal(item);
                          form.setFieldsValue(item);
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
      <Modal
        open={!!modal}
        title="Додати завдання"
        onCancel={() => {
          setModal(null);
          form.resetFields();
          console.log("set modal null");
        }}
        footer={null}
      >
        <Form form={form} initialValues={modal} onFinish={onSubmitExercise} style={{ paddingTop: 16 }}>
          <Flex vertical justify="space-between" align="center">
            <Flex vertical style={{ width: "100%" }}>
              <Form.Item name="id" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="course_id" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="topic_id" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="user_id" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="position" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="text" rules={[{ required: true, message: "Будьласка введіть текст завдання" }]}>
                <Input.TextArea placeholder="Текст завдання" size="large" style={{ minHeight: 200 }} />
              </Form.Item>
            </Flex>
            <Button block type="primary" htmlType="submit" size="large">
              Зберегти
            </Button>
          </Flex>
        </Form>
      </Modal>
    </Flex>
  );
}
