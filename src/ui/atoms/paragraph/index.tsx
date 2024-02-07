import { FC, ReactNode } from "react";
import style from "./index.module.scss";

export type ParagraphProps = {
    children?: ReactNode;
    fontSize?: number;
};

export const Paragraph: FC<ParagraphProps> = ({ children, fontSize = 1 }) => (
    <p className={style.paragraph} style={{ fontSize: `${fontSize}rem` }}>
        {children}
    </p>
);
