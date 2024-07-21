import clsx from "clsx";
import type { FC, ReactNode } from "react";
import style from "./index.module.scss";

export type ButtonProps = {
    children: ReactNode;
    color?: "normal" | "inverted" | "inactive" | "destructive";
    padding?: number;
    rounded?: boolean;
};

export const Button: FC<ButtonProps> = ({ children, padding = 10, rounded = true, color = "normal" }) => (
    <button
      className={clsx([style.button], {
        [style.rounded as string]: rounded,
        [style.color_normal as string]: color === "normal",
        [style.color_inverted as string]: color === "inverted",
        [style.color_inactive as string]: color === "inactive",
        [style.color_destructive as string]: color === "destructive",
      })}
      style={{
        padding: `${padding}px`,
      }}
    >
        {children}
    </button>
);

