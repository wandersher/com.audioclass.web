import { ReactElement } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "antd/dist/reset.css";

import { Flex } from "antd";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type LayoutProps = {
  sidebar?: boolean;
};

export default function Layout({ sidebar }: LayoutProps): ReactElement {
  const location = useLocation();

  console.log("location", location.pathname);

  return (
    <Flex vertical style={{ height: "100vh", width: "100vw", background: "#F1F1F8" }}>
      <Header />
      <Flex flex={4} style={{ overflowY: "hidden" }}>
        <Sidebar />
        <Flex vertical flex={4} style={{ overflowY: "auto" }}>
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  );
}
