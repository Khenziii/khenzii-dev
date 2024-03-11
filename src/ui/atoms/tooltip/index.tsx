import { type CSSProperties, type FC, type ReactNode, useState } from "react";
import style from "./index.module.scss";
import clsx from "clsx";

export type TooltipProps = {
    children: ReactNode;
    tooltip: ReactNode;
    transitionDelay?: number;
    backgroundColor?: string;
    borderColor?: string;
};

export const Tooltip: FC<TooltipProps> = ({ children, tooltip, transitionDelay = 0.5, backgroundColor = "#171617", borderColor = "#5b5e5e" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipStylesheet: CSSProperties = {};
    tooltipStylesheet.backgroundColor = backgroundColor;
    tooltipStylesheet.borderColor = borderColor;
    tooltipStylesheet.transitionDelay = `${transitionDelay}s`;

    return (
        <div className={style.container}>
            <div
                style={tooltipStylesheet}
                className={clsx([
                    style.tooltip,
                    { [style.active as string]: isVisible },
                ])}
            >
                {tooltip}
            </div>

            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
        </div>
    );
};
