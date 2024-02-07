import { type FC, ReactNode, CSSProperties } from "react";
import style from "./index.module.scss";

type position = "flex-start" | "center" | "flex-end";

export type FlexProps = {
    children?: ReactNode;
    direction?: "column" | "column-reverse" | "row" | "row-reverse";
    align?: position;
    justify?: position | "space-between" | "space-around";
    gap?: number;
    styles?: CSSProperties;
};

export const Flex: FC<FlexProps> = ({ children, direction , align, justify, gap , styles }) => {
    const styleSheet: CSSProperties = styles ?? {};
    if (direction !== undefined) styleSheet.flexDirection = direction;
    if (align !== undefined) styleSheet.alignItems = align;
    if (justify !== undefined) styleSheet.justifyItems = justify;
    if (gap !== undefined) styleSheet.gap = `${gap}px !important`;

    return (
        <div className={style.flex} style={styleSheet}>
            {children}
        </div>
    );
}
