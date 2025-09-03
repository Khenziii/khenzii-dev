import type { FC, ReactNode, CSSProperties } from "react";
import { type CustomStyles } from "@khenzii-dev/ui/types";
import clsx from "clsx";
import style from "./index.module.scss";

type position = "flex-start" | "center" | "flex-end";

export type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse";

export type FlexProps = {
    children?: ReactNode;
    direction?: FlexDirection;
    align?: position;
    justify?: position | "space-between" | "space-around";
    gap?: number;
    fullWidth?: boolean;
    id?: string;
} & CustomStyles;

export const Flex: FC<FlexProps> = ({ children, direction , align, justify, gap, fullWidth, styles, className, id }) => {
    const styleSheet: CSSProperties = styles ?? {};
    if (direction !== undefined) styleSheet.flexDirection = direction;
    if (align !== undefined) styleSheet.alignItems = align;
    if (justify !== undefined) styleSheet.justifyContent = justify;
    if (fullWidth !== undefined) styleSheet.width = "100%";
    styleSheet.gap = `${gap ?? 10}px`;

    return (
        <div className={clsx([style.flex], { [className as string]: className !== undefined })} style={styleSheet} id={id}>
            {children}
        </div>
    );
};
