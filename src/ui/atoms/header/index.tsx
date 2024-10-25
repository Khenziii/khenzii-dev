import { type FC, type ReactNode } from "react";
import { Flex, Paragraph } from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";

export type HeaderProps = {
    children: ReactNode;
    fontSize?: number;
};

export const Header: FC<HeaderProps> = ({ children, fontSize = 2 }) => (
    <Flex
        direction={"row"}
        justify={"center"}
        align={"center"}
        className={style.container}
    >
        <hr
            className={style.line}
            style={{ height: `${fontSize * 0.25}rem` }}
        />
        <Paragraph fontSize={fontSize} className={style.text}>{children}</Paragraph>
        <hr
            className={style.line}
            style={{ height: `${fontSize * 0.25}rem` }}
        />
    </Flex>
);
