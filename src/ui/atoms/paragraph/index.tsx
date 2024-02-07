import { FC, ReactNode } from "react";
import style from "./index.module.scss";

export type ParagraphProps = {
    children?: ReactNode;
};

export const Paragraph: FC<ParagraphProps> = ({ children,  }) => (
    <p className={style.paragraph}>
        {children}
    </p>
);
