import type { FC, ReactNode } from "react";
import style from "./index.module.scss";

export type CodeBlockProps = {
    children: ReactNode;
};

export const CodeBlock: FC<CodeBlockProps> = ({ children }) => (
    <code className={style.code_block}>
        {children}
    </code>
);
