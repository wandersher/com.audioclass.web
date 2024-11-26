import React, { useMemo, useState } from "react";

import { Flex, Menu, MenuProps, message } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Icon from "./Icons";
import { useFirestore } from "../libs/firestore";

type MenuItem = Required<MenuProps>["items"][number];

const style = { marginLeft: -8 };
const items: MenuItem[] = [
  {
    key: "dictonaries",
    label: "Навчальні матеріали",
    type: "group",
  },
  {
    key: "/courses",
    label: "Курси",
    icon: <Icon.Library style={style} />,
  },
  {
    key: "/topics",
    label: "Теми",
    icon: <Icon.Topic style={style} />,
  },
  {
    key: "/exercises",
    label: "Завдання",
    icon: <Icon.Exercises style={style} />,
  },
  {
    key: "/answers",
    label: "Відповіді",
    icon: <Icon.Answers style={style} />,
  },
  {
    type: "divider",
  },
  {
    key: "preferences",
    label: "Налаштування",
    type: "group",
  },
  // {
  //   key: "/maria",
  //   label: 'Емулятор "Марія"',
  //   icon: <Icon.ReceiptPrinter style={style} />,
  // },
  {
    key: "/settings",
    label: "Налаштування",
    icon: <Icon.Settings style={style} />,
  },
];

const Sidebar: React.FC = () => {
  const { courses, topics, exercises } = useFirestore();

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const selected = useMemo(() => {
    if (/^\/courses$/.test(location.pathname)) return ["/courses"];
    if (/^\/courses\/[0-9a-f\-]{36}$/.test(location.pathname)) return ["/topics"];
    if (/^\/topics\/[0-9a-f\-]{36}$/.test(location.pathname)) return ["/exercises"];
    return [location.pathname];
  }, [location.pathname]);

  const onSelect = (item: any) => {
    switch (item.key) {
      case "/courses":
        return navigate("/courses");
      case "/topics":
        if (selected.includes("/exercises")) {
          const topic = topics?.find((it) => it.id === params.id);
          if (topic) return navigate(`/courses/${topic.course_id}`);
        }
        return message.warning("Оберіть курс щоб переглянути його теми");
      case "/exercises":
        return message.warning("Оберіть тему курсу щоб переглянути її завдання");
      default:
        navigate(item.key);
    }
  };

  return (
    <Flex vertical style={{ overflowY: "auto", background: "#FFFFFF" }}>
      <Menu style={{ width: SidebarWidth, padding: 8 }} mode="inline" items={items} selectedKeys={selected} onSelect={onSelect} />
    </Flex>
  );
};

export const SidebarWidth = 256;

export default Sidebar;
