import { type InputHTMLAttributes, forwardRef } from "react";
import style from "./index.module.scss";
import clsx from "clsx";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
    rounded?: boolean;
    padding?: number;
    fontSize?: number;
    borderGreenIfValid?: boolean;
    borderRedIfInvalid?: boolean;
    className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    rounded = true,
    padding = 10,
    fontSize = 1.5,
    borderGreenIfValid = false,
    borderRedIfInvalid = false,
    className,
    ...props
}, ref) => (
    <input
        className={clsx([
            style.input,
            { [style.rounded as string]: rounded },
            { [style.green_when_valid as string]: borderGreenIfValid },
            { [style.red_when_invalid as string]: borderRedIfInvalid },
            className,
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

