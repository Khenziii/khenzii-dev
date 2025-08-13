import type { ReactNode, FC } from "react";
import { clsx } from "clsx";
import { type CustomStyles } from "../../types";
import styles from "./index.module.scss";

export type PrimitiveListItemProps = CustomStyles & {
    children: ReactNode;
    level?: number;
};

export const PrimitiveListItem: FC<PrimitiveListItemProps> = ({
    children,
    level = 1,
    className,
    style,
}) => (
    <li
        className={clsx([
            styles["list-item"],
            { [className as string]: className !== undefined },
        ])}
        style={{ marginLeft: `${(level - 1) * 10}px`, ...style }}
    >
        {children}
    </li>
);
