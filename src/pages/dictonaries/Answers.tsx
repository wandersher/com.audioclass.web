import { useEffect, useMemo, useState } from "react";
import Icons from "../../components/Icons";
import { Button, Dropdown, Flex, Space, Tag, Typography, Form, Collapse, List as AntList } from "antd";
import { useFirestore } from "../../libs/firestore";
import { useLocation } from "react-router-dom";

export function Answers() {
  const location = useLocation();

  const { topics, exercises } = useFirestore();

  const answers = [
    {
      name: "Андрій Биків",
      text: "Екосистема ділиться на еко і систему",
      course_id: "465b28b6-13c3-4c32-b46c-f131322149c8",
      topic_id: "7e16847e-568b-4326-be5f-8de060328d1e",
      exercise_id: "3c96b72e-1e86-4dcb-a326-f3a4bec6185f",
    },
    {
      name: "Василь Сидоряк",
      text: "Екосистема ділиться на еко і систему",
      course_id: "465b28b6-13c3-4c32-b46c-f131322149c8",
      topic_id: "7e16847e-568b-4326-be5f-8de060328d1e",
      exercise_id: "3c96b72e-1e86-4dcb-a326-f3a4bec6185f",
    },
    {
      name: "Марія Сеньків",
      text: "Екосистема ділиться на еко і систему",
      course_id: "465b28b6-13c3-4c32-b46c-f131322149c8",
      topic_id: "7e16847e-568b-4326-be5f-8de060328d1e",
      exercise_id: "3c96b72e-1e86-4dcb-a326-f3a4bec6185f",
    },
  ];

  const list = useMemo(() => {
    let result_topics = [];
    if (!topics || !exercises) return null;
    for (let topic of topics) {
      const topic_exercises = exercises.filter((it) => it.topic_id == topic.id);
      if (!topic_exercises.length) continue;
      let result_exercises = [];
      for (let topic_exercise of topic_exercises) {
        const topic_exercise_answers = answers.filter((it) => it.exercise_id == topic_exercise.id);
        result_exercises.push({ ...topic_exercise, answers: topic_exercise_answers });
      }
      const all_answers = result_exercises.reduce((acc, next) => acc + (next.all_answers ?? 0), 0);
      const new_answers = result_exercises.reduce((acc, next) => acc + (next.new_answers ?? 0), 0);
      // const topic_new_answers = topic_exercises.reduce((acc,it)=> acc + (it.new_answers ?? 0), 0)
      result_topics.push({
        ...topic,
        all_answers,
        new_answers,
        exercises: result_exercises.sort((a, b) => (a.position > b.position ? 1 : -1)),
      });
    }
    return result_topics.sort((a, b) => (a.new_answers < b.new_answers ? 1 : -1));
  }, [topics, exercises]);

  const [modal, setModal] = useState<any>(null);
  const [form] = Form.useForm();

  // const onDelete = (item: any) => {
  //   Modal.confirm({
  //     title: "Ви впевнені що бажаєте видалити курс?",
  //     icon: <Icons.Delete style={{ marginRight: 16 }} />,
  //     content: "Цю дію не можливо скасувати",
  //     okText: "Так",
  //     okType: "danger",
  //     cancelText: "Скасувати",
  //     onOk: () => {
  //       deleteCourse(item)
  //         .then(() => message.success("Курс успішно видалено"))
  //         .catch(() => message.error("Помилка видалення курсу"));
  //     },
  //   });
  // };

  const [collapsed_topic, setCollapsedTopic] = useState<string[]>([]);
  const [collapsed_exercise, setCollapsedExercise] = useState<string[]>([]);

  const menu = {
    items: [
      {
        key: "edit",
        label: <Typography.Text>Редагувати</Typography.Text>,
        icon: <Icons.Edit size={18} />,
        onClick: () => {},
      },
      {
        key: "delete",
        label: <Typography.Text>Видалити</Typography.Text>,
        icon: <Icons.Delete size={18} color="red" />,
        onClick: () => {},
      },
    ],
  };
  const onClickTopic = (topic_id: string) =>
    setCollapsedTopic((current) => (current.includes(topic_id) ? current.filter((it) => it != topic_id) : [...current, topic_id]));
  const onClickExercise = (exercise_id: string) =>
    setCollapsedExercise((current) => (current.includes(exercise_id) ? current.filter((it) => it != exercise_id) : [...current, exercise_id]));

  return (
    <Flex vertical style={{ padding: 32, paddingTop: 16 }}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={2}>Відповіді</Typography.Title>
        <Flex style={{ marginBottom: 15 }}>
          <Button type="primary" onClick={() => setModal({})}>
            Додати
          </Button>
        </Flex>
      </Flex>
      <Space direction="vertical">
        <Collapse
          style={{ background: "#fff" }}
          collapsible="icon"
          activeKey={collapsed_topic}
          onChange={setCollapsedTopic}
          items={list?.map((topic) => {
            return {
              key: topic.id,
              label: (
                <Flex justify="flex-start">
                  <Flex onClick={() => onClickTopic(topic.id)} style={{ cursor: "pointer" }}>
                    {topic.new_answers ? <Tag color="success">{topic.new_answers}</Tag> : <Tag color="default">{topic.all_answers}</Tag>}
                    <Typography.Text>{topic.name}</Typography.Text>
                  </Flex>
                </Flex>
              ),
              children: (
                <Collapse
                  style={{ background: "#fff" }}
                  collapsible="icon"
                  activeKey={collapsed_exercise}
                  onChange={setCollapsedExercise}
                  items={topic.exercises.map((exercise) => {
                    return {
                      key: exercise.id,
                      label: (
                        <Flex justify="space-between">
                          <Flex onClick={() => onClickExercise(exercise.id)} style={{ cursor: "pointer" }}>
                            {exercise.new_answers ? (
                              <Tag color="success">{exercise.new_answers}</Tag>
                            ) : (
                              <Tag color="default">{exercise.all_answers ?? 0}</Tag>
                            )}
                            <Typography.Text>{`${exercise.position + 1}) ${exercise.text}`}</Typography.Text>
                          </Flex>
                          <Dropdown menu={menu} trigger={["click"]} arrow>
                            <Button type="text" style={{ margin: 0, padding: 0, height: 22, width: 22 }}>
                              <Icons.MoreHorizontal size={22} />
                            </Button>
                          </Dropdown>
                        </Flex>
                      ),
                      children: (
                        <AntList
                          itemLayout="horizontal"
                          dataSource={exercise.answers}
                          renderItem={(item, index) => (
                            <AntList.Item>
                              <Flex justify="space-between" style={{ width: "100%" }}>
                                <Flex vertical>
                                  <Typography.Title level={5}>{item.name}</Typography.Title>
                                  <Typography.Text>{item.text}</Typography.Text>
                                </Flex>
                                <Button icon={<Icons.Audio />} type="default" size="large">
                                  Прослухати
                                </Button>
                                {/* <Button icon={<Icons.Pause />} type="primary" size="large">
                              Зупитини
                            </Button> */}
                              </Flex>
                            </AntList.Item>
                          )}
                        />
                      ),
                    };
                  })}
                />
              ),
            };
          })}
        />
      </Space>
    </Flex>
  );
}
