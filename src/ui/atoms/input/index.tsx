import { type InputHTMLAttributes, forwardRef } from "react";
import style from "./index.module.scss";
import clsx from "clsx";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    rounded?: boolean;
    padding?: number;
    fontSize?: number;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ rounded = true, padding = 10, fontSize = 1.5, ...props }, ref) => (
    <input
        className={clsx([
            style.input,
            { [style.rounded as string]: rounded },
        ])}
        style={{
            padding: `${padding}px`,
            fontSize: `${fontSize}rem`,
        }}
        ref={ref}
        {...props}
    />
));

Input.displayName = "Input";

