import { useEffect, useMemo, useState } from "react";
import Icons from "../../components/Icons";
import { Button, Dropdown, Flex, Space, Tag, Typography, Form, Collapse, List as AntList } from "antd";
import { useFirestore } from "../../libs/firestore";
import { useLocation } from "react-router-dom";
import Listen from "../../components/Listen";

export function Answers() {
  const location = useLocation();

  const { topics, exercises, answers } = useFirestore();

  const list = useMemo(() => {
    let result_topics = [];
    if (!topics || !exercises) return null;
    for (let topic of topics) {
      const topic_exercises = exercises.filter((it) => it.topic_id == topic.id);
      if (!topic_exercises.length) continue;
      let result_exercises = [];
      for (let topic_exercise of topic_exercises) {
        const topic_exercise_answers = (answers ?? []).filter((it) => it.exercise_id == topic_exercise.id);
        result_exercises.push({ ...topic_exercise, answers: topic_exercise_answers, answers_count: topic_exercise_answers.length });
      }
      const answers_count = result_exercises.reduce((acc, next) => acc + (next.answers_count ?? 0), 0);
      // const topic_new_answers = topic_exercises.reduce((acc,it)=> acc + (it.new_answers ?? 0), 0)
      result_topics.push({
        ...topic,
        answers_count,
        exercises: result_exercises.sort((a, b) => (a.position > b.position ? 1 : -1)),
      });
    }
    return result_topics;
  }, [topics, exercises, answers]);

  const [modal, setModal] = useState<any>(null);
  const [form] = Form.useForm();

  const [collapsed_topic, setCollapsedTopic] = useState<string[]>([]);
  const [collapsed_exercise, setCollapsedExercise] = useState<string[]>([]);

  const onClickTopic = (topic_id: string) =>
    setCollapsedTopic((current) => (current.includes(topic_id) ? current.filter((it) => it != topic_id) : [...current, topic_id]));
  const onClickExercise = (exercise_id: string) =>
    setCollapsedExercise((current) => (current.includes(exercise_id) ? current.filter((it) => it != exercise_id) : [...current, exercise_id]));

  return (
    <Flex vertical style={{ padding: 32, paddingTop: 16 }}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={2}>Відповіді</Typography.Title>
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
                    <Tag color={topic.answers_count ? "success" : "default"}>{topic.answers_count}</Tag>
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
                        <Flex onClick={() => onClickExercise(exercise.id)} style={{ cursor: "pointer" }}>
                          <Tag color={exercise.answers_count ? "success" : "default"}>{exercise.answers_count}</Tag>
                          <Typography.Text>{`(${exercise.position + 1}) ${exercise.text}`}</Typography.Text>
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
                                  <Typography.Title level={5}>{item.sender_name}</Typography.Title>
                                  <Typography.Text>{item.text}</Typography.Text>
                                </Flex>
                                <Listen
                                  url={item.audio}
                                  playComponent={({ play }) => (
                                    <Button icon={<Icons.Audio />} type="default" size="large" onClick={play}>
                                      Прослухати
                                    </Button>
                                  )}
                                  pauseComponent={({ pause }) => (
                                    <Button icon={<Icons.Pause />} type="default" size="large" onClick={pause}>
                                      Прослухати
                                    </Button>
                                  )}
                                />
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
