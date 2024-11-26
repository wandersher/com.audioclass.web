import { Badge, Button, Flex, Typography } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Icons from "./Icons";

import logo from "../assets/logo.svg";
import { useFirebase } from "../libs/firebase";
import { SidebarWidth } from "./Sidebar";

type HeaderButtonProps = {
  last?: boolean;
  active?: boolean;
  onClick?: () => any;
  children: any;
};
export function HeaderButton({ children, active, last, onClick }: HeaderButtonProps) {
  return (
    <Button
      color={active ? "primary" : undefined}
      variant={active ? "filled" : undefined}
      type={active ? undefined : "text"}
      style={{ padding: 8, height: "auto", marginRight: last ? 0 : 8 }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function Header() {
  const { signout } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [previous, setPrevious] = useState("/app/registers");
  useEffect(() => {
    if (location.pathname.startsWith("/app")) setPrevious(location.pathname);
  }, [location.pathname]);

  const is_auth = location.pathname.startsWith("/auth");
  const is_app = location.pathname.startsWith("/app");
  const is_logs = location.pathname.startsWith("/logs");

  const { profile, name } = useFirebase();

  return (
    <Flex style={{ height: 72, borderBottom: "1px solid rgba(5,5,5,0.06)", background: "#FFFFFF" }}>
      <Flex style={{ width: SidebarWidth, padding: 4 }} justify="center">
        <img src={logo} style={{ height: "100%" }} />
      </Flex>
      <Flex flex={1} justify="space-between" align="center" style={{ padding: 8, paddingLeft: 32, paddingRight: 32 }}>
        <Flex>
          <div></div>
          {/* <HeaderButton active={is_app} onClick={() => navigate(previous)}>
            <Icons.Computer size={32} />
          </HeaderButton>
          <HeaderButton active={is_logs} onClick={() => navigate("/logs")}>
            <Icons.Code size={32} style={{ position: "absolute" }} />
            <Badge count={5} overflowCount={99}>
              <Icons.Code size={32} color="transparent" />
            </Badge>
          </HeaderButton> */}
        </Flex>

        <Flex align="center">
          <Typography.Text strong style={{ marginRight: 8 }}>
            {name}
          </Typography.Text>
          <HeaderButton active={is_auth} last onClick={() => signout()}>
            <Icons.Logout size={32} color="red" />
          </HeaderButton>
        </Flex>
      </Flex>
    </Flex>
  );
}
