import type { ReactNode, FC } from "react";
import { clsx } from "clsx";
import { type CustomStyles } from "../../types";
import style from "./index.module.scss";

export type PrimitiveListItemProps = CustomStyles & {
    children: ReactNode;
    level?: number;
};

export const PrimitiveListItem: FC<PrimitiveListItemProps> = ({
    children,
    level = 1,
    className,
    styles,
}) => (
    <li
        className={clsx([
            style["list-item"],
            { [className as string]: className !== undefined },
        ])}
        style={{ marginLeft: `${level * 10}px`, ...styles }}
    >
        {children}
    </li>
);
