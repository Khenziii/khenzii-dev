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
        viewBox='0 0 13 13'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={clsx({[style.noAnimate as string]: !animate})}
    >
        <g className={style.threeWrapper}>
            <rect x="5" y="5" width="1" height="1" className={style["three-1"]} />
            <rect x="5" y="4" width="1" height="1" className={style["three-2"]} />
            <rect x="4" y="5" width="1" height="1" className={style["three-3"]} />
            <rect x="5" y="3" width="1" height="1" className={style["three-4"]} />
            <rect x="3" y="5" width="1" height="1" className={style["three-5"]} />
            <rect x="5" y="2" width="1" height="1" className={style["three-6"]} />
            <rect x="4" y="3" width="1" height="1" className={style["three-7"]} />
            <rect x="5" y="1" width="1" height="1" className={style["three-8"]} />
            <rect x="3" y="3" width="1" height="1" className={style["three-9"]} />
            <rect x="4" y="1" width="1" height="1" className={style["three-10"]} />
            <rect x="3" y="1" width="1" height="1" className={style["three-11"]} />
        </g>

        <g className={style.aWrapper}>
            <rect x="7" y="5" width="1" height="1" className={style["a-1"]} />
            <rect x="7" y="4" width="1" height="1" className={style["a-2"]} />
            <rect x="7" y="3" width="1" height="1" className={style["a-3"]} />
            <rect x="8" y="4" width="1" height="1" className={style["a-4"]} />
            <rect x="7" y="2" width="1" height="1" className={style["a-5"]} />
            <rect x="9" y="4" width="1" height="1" className={style["a-6"]} />
            <rect x="8" y="2" width="1" height="1" className={style["a-7"]} />
            <rect x="9" y="5" width="1" height="1" className={style["a-8"]} />
            <rect x="8" y="1" width="1" height="1" className={style["a-9"]} />
            <rect x="9" y="3" width="1" height="1" className={style["a-10"]} />
            <rect x="9" y="2" width="1" height="1" className={style["a-11"]} />
        </g>

        <g className={style.twoWrapper}>
            <rect x="4" y="7" width="1" height="1" className={style["two-2"]} />
            <rect x="5" y="8" width="1" height="1" className={style["two-3"]} />
            <rect x="3" y="7" width="1" height="1" className={style["two-1"]} />
            <rect x="4" y="9" width="1" height="1" className={style["two-4"]} />
            <rect x="3" y="10" width="1" height="1" className={style["two-5"]} />
            <rect x="3" y="11" width="1" height="1" className={style["two-6"]} />
            <rect x="4" y="11" width="1" height="1" className={style["two-7"]} />
            <rect x="5" y="11" width="1" height="1" className={style["two-8"]} />
        </g>

        <g className={style.nineWrapper}>
            <rect x="7" y="7" width="1" height="1" className={style["nine-1"]} />
            <rect x="8" y="7" width="1" height="1" className={style["nine-2"]} />
            <rect x="7" y="8" width="1" height="1" className={style["nine-3"]} />
            <rect x="9" y="7" width="1" height="1" className={style["nine-4"]} />
            <rect x="7" y="9" width="1" height="1" className={style["nine-5"]} />
            <rect x="9" y="8" width="1" height="1" className={style["nine-6"]} />
            <rect x="8" y="9" width="1" height="1" className={style["nine-7"]} />
            <rect x="9" y="9" width="1" height="1" className={style["nine-8"]} />
            <rect x="9" y="10" width="1" height="1" className={style["nine-9"]} />
            <rect x="9" y="11" width="1" height="1" className={style["nine-10"]} />
            <rect x="8" y="11" width="1" height="1" className={style["nine-11"]} />
            <rect x="7" y="11" width="1" height="1" className={style["nine-12"]} />
        </g>
    </svg>
);
