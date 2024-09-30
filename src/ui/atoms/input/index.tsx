import {
    type InputHTMLAttributes,
    type TextareaHTMLAttributes,
    type Ref,
    type CSSProperties,
    forwardRef,
} from "react";
import { type CustomStyles } from "@khenzii-dev/ui/types";
import style from "./index.module.scss";
import clsx from "clsx";

export type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className" | "style"
> & {
    rounded?: boolean;
    padding?: number;
    fontSize?: number;
    borderGreenIfValid?: boolean;
    borderRedIfInvalid?: boolean;
    textarea?: boolean;
} & CustomStyles;

export const Input = forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    InputProps
>(({
    rounded = true,
    padding = 10,
    fontSize = 1.5,
    borderGreenIfValid = false,
    borderRedIfInvalid = false,
    textarea = false,
    className,
    styles,
    ...props
}, ref) => {
    const commonClassName = clsx([
        style.input,
        { [style.rounded as string]: rounded },
        { [style.green_when_valid as string]: borderGreenIfValid },
        { [style.red_when_invalid as string]: borderRedIfInvalid },
        className,
    ]);

    const commonStyles: CSSProperties = {
        padding: `${padding}px`,
        fontSize: `${fontSize}rem`,
        ...styles,
    };

    return (
        <>
            {textarea ? (
                <textarea
                    className={commonClassName}
                    style={commonStyles}
                    ref={ref as Ref<HTMLTextAreaElement>}
                    {...props}
                />
            ) : (
                <input
                    className={commonClassName}
                    style={commonStyles}
                    ref={ref as Ref<HTMLInputElement>}
                    {...props}
                />
            )}
        </>
    );
});

Input.displayName = "Input";

