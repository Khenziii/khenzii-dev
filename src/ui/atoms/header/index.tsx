import { type FC, type ReactNode } from "react";
import { Flex, Paragraph } from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";

export type HeaderProps = {
    children: ReactNode;
    fontsize?: number;
};

export const Header: FC<HeaderProps> = ({ children, fontsize = 2 }) => (
    <Flex
        direction={"row"}
        justify={"center"}
        align={"center"}
        className={style.container}
    >
        <hr
            className={style.line}
            style={{ height: `${fontsize * 0.25}rem` }}
        />
        <Paragraph fontSize={fontsize} className={style.text}>{children}</Paragraph>
        <hr
            className={style.line}
            style={{ height: `${fontsize * 0.25}rem` }}
        />
    </Flex>
);
