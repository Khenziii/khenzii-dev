import type { FC, ReactNode } from "react";
import style from "./index.module.scss";
import clsx from "clsx";
import { type CustomStyles } from "@khenzii-dev/ui/types";

export type ParagraphProps = CustomStyles & {
    children?: ReactNode;
    fontSize?: number;
};

export const Paragraph: FC<ParagraphProps> = ({ className, styles, children, fontSize = 1 }) => (
    <p className={clsx(style.paragraph, { [className as string]: className !== undefined })} style={{ fontSize: `${fontSize}rem`, ...styles }}>
        {children}
    </p>
);
