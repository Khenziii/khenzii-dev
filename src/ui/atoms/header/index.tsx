import { type FC, type ReactNode } from "react";
import { Flex, Paragraph } from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";

export type HeaderProps = {
    children: ReactNode;
    fontSize?: number;
    variant?: "primary" | "secondary";
};

export const Header: FC<HeaderProps> = ({ children, fontSize = 2, variant = "primary" }) => {
    if (variant === "primary") return (
        <Flex
            direction={"row"}
            justify={"center"}
            align={"center"}
            fullWidth
        >
            <hr
                className={style.line_primary}
                style={{ height: `${fontSize * 0.25}rem` }}
            />
            <Paragraph fontSize={fontSize} className={style.text_primary}>{children}</Paragraph>
            <hr
                className={style.line_primary}
                style={{ height: `${fontSize * 0.25}rem` }}
            />
        </Flex>
    );

    return (
        <Flex
            direction={"row"}
            align={"center"}
        >
            <hr
                className={style.line_secondary}
                style={{ height: `${fontSize}rem`, minWidth: `${fontSize * 0.25}rem` }}
            />
            <Paragraph fontSize={fontSize}>{children}</Paragraph>
        </Flex>
    );
};
