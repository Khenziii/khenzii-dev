import { type FC } from "react";
import style from "./index.module.scss";
import clsx from "clsx";

export type LogoProps = {
    size?: number;
    animate?: boolean;
};

export const Logo: FC<LogoProps> = ({ size = 100, animate = false }) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 150 150'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M75 75 L25 75'
            className={style.tile}
        />
    </svg>
);
