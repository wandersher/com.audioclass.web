import { useEffect, useMemo, useState } from "react";
import Icons from "../../components/Icons";
import List from "../../components/List";
import { Button, Card, Dropdown, Flex, Input, MenuProps, message, Modal, Space, Tag, Tooltip, Typography, Form, Select } from "antd";
import { useFirestore } from "../../libs/firestore";
import { v4 } from "uuid";
import { Link, useLocation, useParams } from "react-router-dom";
import { Loading } from "../Loading";
import Listen from "../../components/Listen";

export function Exercises() {
  const { courses, topics, exercises, saveExercise, deleteExercise } = useFirestore();

  // const topic = useMemo(() => topics?.find((it) => it.id === id), [id, topics]);

  const [course, setCourse] = useState<any>(null);
  const [topic, setTopic] = useState<any>(null);

  const [modal, setModal] = useState<any>(null);
  const [form] = Form.useForm();

  const course_topics = useMemo(() => topics?.filter((it) => !course || it.course_id === course.id), [topics, course]);

  const list = useMemo(
    () =>
      exercises
        ?.filter((it) => (!course || it.course_id === course?.id) && (!topic || it.topic_id == topic?.id))
        .sort((a, b) => (a.position > b.position ? 1 : -1)),
    [exercises, course, topic]
  );

  const onSubmitExercise = async ({ id, ...data }: any) => {
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

  if (!list) return <Loading />;

  return (
    <Flex vertical style={{ padding: 32, paddingTop: 16 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Flex>
          <Select
            placeholder="Оберіть курс"
            style={{ width: 300, marginRight: 16 }}
            value={course?.id ?? ""}
            onChange={(id) => {
              setCourse(courses?.find((it) => it.id === id));
              setTopic(null);
            }}
            size="large"
          >
            <Select.Option key={"n-course"} value={""}>
              Всі курси
            </Select.Option>
            {courses?.map((course) => (
              <Select.Option key={course.id} value={course.id}>
                {course.name} {course.group ? `(${course.group})` : null}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Оберіть тему"
            style={{ width: 300 }}
            value={topic?.id ?? ""}
            onChange={(id) => setTopic(topics?.find((it) => it.id === id))}
            size="large"
          >
            <Select.Option key={"n-topic"} value={""}>
              Всі теми
            </Select.Option>
            {course_topics?.map((topic) => (
              <Select.Option key={topic.id} value={topic.id}>
                {topic.name}
              </Select.Option>
            ))}
          </Select>
        </Flex>
        <Flex>
          {course && topic ? (
            <Button
              type="primary"
              onClick={() => {
                const position = list ? (list.at(list.length - 1)?.position ?? 0) + 1 : 0;
                const item = {
                  id: undefined,
                  course_id: course.id,
                  topic_id: topic.id,
                  position,
                  text: "",
                };
                setModal(item);
                form.setFieldsValue(item);
              }}
              size="large"
            >
              Додати завдання
            </Button>
          ) : null}
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
