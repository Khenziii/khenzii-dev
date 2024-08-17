import clsx from "clsx";
import type { FC, ReactNode, ButtonHTMLAttributes } from "react";
import style from "./index.module.scss";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    color?: "normal" | "inverted" | "inactive" | "destructive";
    padding?: number;
    rounded?: boolean;
};

export const Button: FC<ButtonProps> = ({ children, padding = 10, rounded = true, color = "normal", ...props }) => (
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
      {...props}
    >
        {children}
    </button>
);

