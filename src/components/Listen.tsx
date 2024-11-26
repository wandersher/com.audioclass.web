import { Flex } from "antd";
import React, { ReactElement, useEffect, useMemo, useState } from "react";

type ListenProps = {
  url: string;
  playComponent: (props: { play: () => any }) => ReactElement;
  pauseComponent: (props: { pause: () => any }) => ReactElement;
};

export default function Listen(props: ListenProps) {
  const { url, playComponent, pauseComponent } = props;

  const audio = useMemo(() => new Audio(url), [url]);
  const [state, setState] = useState(false);

  useEffect(() => {
    const listener = () => setState(false);
    audio.addEventListener("ended", listener);
    return () => audio.removeEventListener("ended", listener);
  }, [audio]);

  const play = () => {
    audio.play();
    setState(true);
  };

  const pause = () => {
    audio.pause();
    setState(false);
  };

  return (
    <Flex align="center" justify="center">
      {state ? pauseComponent({ pause }) : playComponent({ play })}
    </Flex>
  );
}
