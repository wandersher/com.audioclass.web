import { Flex, List as AntList, Typography, Tooltip } from "antd";
import { ReactElement, useMemo, useRef, useState } from "react";
import Icons from "./Icons";

type Header = {
  key: string;
  title: string | ReactElement;
  flex?: number;
  width?: number;
  center?: boolean;
  right?: boolean;
  overflow?: boolean;
};

type RenderFunction<T> = (item: T, key: string, row: number) => any;

type ListProps<T> = {
  headers: Header[];
  list: T[];
  render: RenderFunction<T>;
};

type ListItemProps<T> = {
  headers: Header[];
  item?: any;
  row: number;
  render?: RenderFunction<T>;
};

export function ListItem<T extends object>({ headers, item, row, render }: ListItemProps<T>) {
  const text = useRef<HTMLSpanElement>(null);
  return (
    <Flex flex={1} align="center">
      {headers.map(({ key, title, width, flex, right, center, overflow }, index) => {
        const [is_elipsis, setIsElipsys] = useState(false);
        return (
          <Flex
            key={`row-${row}-${index}-${title}`}
            flex={width ? undefined : flex}
            style={{ overflow: overflow ? "visible" : "hidden", width }}
            justify={center ? "center" : right ? "flex-end" : "flex-start"}
            align="center"
          >
            {item && render ? (
              render(item, key, row) ?? (
                <Tooltip placement="bottom" title={typeof item[key] == "string" && is_elipsis ? item[key] : ""} arrow>
                  <Typography.Text
                    ref={text}
                    style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingRight: 8 }}
                    onMouseOver={(e) => {
                      if (e.currentTarget.offsetWidth < e.currentTarget.scrollWidth != is_elipsis)
                        setIsElipsys(e.currentTarget.offsetWidth < e.currentTarget.scrollWidth);
                    }}
                  >
                    {item[key]}
                  </Typography.Text>
                </Tooltip>
              )
            ) : typeof title === "string" ? (
              <Typography.Text strong>{title}</Typography.Text>
            ) : (
              title
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}

export default function List<T extends object>({ headers, list, render }: ListProps<T>) {
  return (
    <AntList
      size="small"
      style={{ background: "#FFFFFF" }}
      locale={{
        emptyText: (
          <Flex vertical align="center" style={{ padding: 16 }}>
            <Icons.Inbox style={{ marginBottom: 16 }} size={32} color="#aeaeae" />
            <Typography.Text style={{ color: "#aeaeae" }}>Немає даних</Typography.Text>
          </Flex>
        ),
      }}
      header={<ListItem headers={headers} row={-1} />}
      bordered
      dataSource={list}
      renderItem={(item, row) => (
        <AntList.Item>
          <ListItem headers={headers} item={item} row={row} render={render} />
        </AntList.Item>
      )}
    />
  );
}
