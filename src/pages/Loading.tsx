import { Flex, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingView from "../components/Spinner";

type LoadingProps = {
  title?: string;
};

export function Loading({ title }: LoadingProps) {
  return (
    <Flex vertical justify="center" align="center" style={{ height: "100vh" }}>
      <LoadingView size={200} />
      {title ? <Typography.Title style={{ position: "absolute", bottom: 120 }}>{title}</Typography.Title> : null}
    </Flex>
  );
}
