import { type FC, ReactNode, CSSProperties } from "react";
import clsx from "clsx";
import style from "./index.module.scss";

type position = "flex-start" | "center" | "flex-end";

export type FlexProps = {
    children?: ReactNode;
    direction?: "column" | "column-reverse" | "row" | "row-reverse";
    align?: position;
    justify?: position | "space-between" | "space-around";
    gap?: number;
    fullWidth?: boolean;
    styles?: CSSProperties;
    className?: string;
};

export const Flex: FC<FlexProps> = ({ children, direction , align, justify, gap , fullWidth, styles, className }) => {
    const styleSheet: CSSProperties = styles ?? {};
    if (direction !== undefined) styleSheet.flexDirection = direction;
    if (align !== undefined) styleSheet.alignItems = align;
    if (justify !== undefined) styleSheet.justifyContent = justify;
    if (gap !== undefined) styleSheet.gap = `${gap}px !important`;
    if (fullWidth !== undefined) styleSheet.width = "100% !important";

    return (
        <div className={clsx([style.flex], {[className as string]: className !== undefined})} style={styleSheet}>
            {children}
        </div>
    );
}
