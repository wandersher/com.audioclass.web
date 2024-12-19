import { useEffect, useMemo, useState } from "react";
import Icons from "../../components/Icons";
import List from "../../components/List";
import { Button, Card, Dropdown, Flex, Input, MenuProps, message, Modal, Space, Tag, Tooltip, Typography, Form, Select } from "antd";
import { useFirestore } from "../../libs/firestore";
import { v4 } from "uuid";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loading } from "../Loading";
import Listen from "../../components/Listen";

export function Course() {
  const { id = "" } = useParams();
  const { courses, topics, exercises, saveTopic, deleteTopic } = useFirestore();
  const navigate = useNavigate();

  const course = useMemo(() => (id ? courses?.find((it) => it.id === id) : null), [id, courses]);
  const list = useMemo(
    () => (id ? topics?.filter((it) => it.course_id === id).sort((a, b) => (a.position > b.position ? 1 : -1)) : topics),
    [id, topics]
  );
  const course_exercises = useMemo(() => (id ? exercises?.filter((it) => it.course_id === id) : exercises), [id, exercises]);

  const [modal, setModal] = useState<any>(null);
  const [form] = Form.useForm();

  const onSubmit = async ({ id, ...data }: any) => {
    await saveTopic({ id: id ?? v4(), ...data });
    message.success(id ? "Тему успішно змінено" : "Тему успішно створено");
    setModal(null);
  };

  const onDelete = (item: any) => {
    // Modal.confirm({
    //   title: "Ви впевнені що бажаєте видалити курс?",
    //   icon: <Icons.Delete style={{ marginRight: 16 }} />,
    //   content: "Цю дію не можливо скасувати",
    //   okText: "Так",
    //   okType: "danger",
    //   cancelText: "Скасувати",
    //   onOk: () => {
    //     deleteCourse(item)
    //       .then(() => message.success("Курс успішно видалено"))
    //       .catch(() => message.error("Помилка видалення курсу"));
    //   },
    // });
  };
  console.log("course", course);
  if ((id && !course) || !list) return <Loading />;

  return (
    <Flex vertical style={{ padding: 32, paddingTop: 16 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Select
          placeholder="Оберіть курс"
          style={{ width: 300 }}
          value={id}
          onChange={(id) => (id ? navigate(`/courses/${id}`) : navigate("/topics"))}
          size="large"
        >
          <Select.Option key={"undefined"} value={""}>
            Всі теми
          </Select.Option>
          {courses?.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name} {course.group ? `(${course.group})` : null}
            </Select.Option>
          ))}
        </Select>

        <Flex>
          {id ? (
            <Button
              type="primary"
              onClick={() => {
                const position = list ? (list.at(list.length - 1)?.position ?? 0) + 1 : 0;
                setModal({ course_id: id, position });
                form.setFieldsValue({ course_id: id, position });
              }}
            >
              Додати
            </Button>
          ) : null}
        </Flex>
      </Flex>
      <List
        headers={[
          { key: "position", title: "#", width: 32 },
          { key: "audio_name", title: <Icons.Audio size={20} style={{ margin: 2 }} />, width: 48 },
          { key: "name", title: "Назва теми", flex: 20 },
          { key: "text", title: "Текст", flex: 5 },
          { key: "exercises", title: "Завдання", flex: 5 },
          { key: "actions", title: "Дії", width: 32 },
        ]}
        list={list ?? []}
        render={(item, key, position) => {
          switch (key) {
            case "position":
              return item.position;
            case "audio_name":
              return !item.audio_name ? (
                <Icons.Loading size={24} style={{ animation: `spin 1s linear infinite` }} />
              ) : (
                <Listen
                  url={item.audio_name}
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
              return <Link to={`/topics/${item.id}`}>{item.name}</Link>;
            case "text":
              return <Typography.Text>{item.text?.length ?? 0} символів</Typography.Text>;
            case "exercises":
              const count = course_exercises?.filter((it) => it.topic_id === item.id)?.length ?? 0;
              return <Typography.Text>{count} </Typography.Text>;
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

      <Modal open={!!modal} title="Додати тему" onCancel={() => setModal(null)} footer={null}>
        <Form form={form} initialValues={modal} onFinish={onSubmit} style={{ paddingTop: 16 }}>
          <Flex vertical justify="space-between" align="center">
            <Flex vertical style={{ width: "100%" }}>
              <Form.Item name="id" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="course_id" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="position" noStyle>
                <Input hidden />
              </Form.Item>
              <Form.Item name="name" rules={[{ required: true, message: "Будьласка введіть назву курсу" }]}>
                <Input placeholder="Назва теми" size="large" />
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

<Form.Item name="text" rules={[{ required: false }]}>
  <Input.TextArea placeholder="Текст теми" size="large" style={{ minHeight: 300 }} />
</Form.Item>;
