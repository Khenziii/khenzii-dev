"use client";

import { type FC, memo } from "react";
import { type SvgData } from "@khenzii-dev/ui/types";
import style from "./index.module.scss";
import { motion } from "framer-motion";

const animationDelay =  0.1;
const tileVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const logoData: SvgData = [
    {
        wrapperName: "three",
        squares: [
            { x: 2, y: 4 },
            { x: 2, y: 3 },
            { x: 1, y: 4 },
            { x: 2, y: 2 },
            { x: 0, y: 4 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
            { x: 2, y: 0 },
            { x: 0, y: 2 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
        ],
    },
    {
        wrapperName: "a",
        squares: [
            { x: 4, y: 4 },
            { x: 4, y: 3 },
            { x: 4, y: 2 },
            { x: 5, y: 3 },
            { x: 4, y: 1 },
            { x: 6, y: 3 },
            { x: 5, y: 1 },
            { x: 6, y: 4 },
            { x: 5, y: 0 },
            { x: 6, y: 2 },
            { x: 6, y: 1 },
        ],
    },
    {
        wrapperName: "two",
        squares: [
            { x: 1, y: 6 },
            { x: 2, y: 7 },
            { x: 0, y: 6 },
            { x: 1, y: 8 },
            { x: 0, y: 9 },
            { x: 0, y: 10 },
            { x: 1, y: 10 },
            { x: 2, y: 10 },
        ],
    },
    {
        wrapperName: "nine",
        squares: [
            { x: 4, y: 6 },
            { x: 5, y: 6 },
            { x: 4, y: 7 },
            { x: 6, y: 6 },
            { x: 4, y: 8 },
            { x: 6, y: 7 },
            { x: 5, y: 8 },
            { x: 6, y: 8 },
            { x: 6, y: 9 },
            { x: 6, y: 10 },
            { x: 5, y: 10 },
            { x: 4, y: 10 },
        ],
    },
];


type MemoizedRectProps = {
    x: number;
    y: number;
    initial?: string;
    animate?: string;
    transition?: {
        delay: number;
    };
};

const MemoizedRect: FC<MemoizedRectProps> = memo(({ x, y, initial, animate, transition }) => (
    <motion.rect
        x={x}
        y={y}
        width="1"
        height="1"
        className={style.tile}
        variants={tileVariants}
        initial={initial}
        animate={animate}
        transition={transition}
    />
));
MemoizedRect.displayName = "LogoMemoizedRect";


export type LogoProps = {
    size?: number;
    animate?: boolean;
};

export const Logo: FC<LogoProps> = ({ size = 100, animate = false }) => (
    <svg
        height={size}
        viewBox='0 0 7 11'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        {logoData.map((wrapper) =>
            wrapper.squares.map((squareSet, index) => {
                const animationConfig = {
                    initial: "hidden",
                    animate: "visible",
                    transition: {
                        delay: animationDelay * index,
                    },
                };

                return (
                    <MemoizedRect key={`${wrapper.wrapperName}-${index}`} x={squareSet.x} y={squareSet.y} {...(animate ? animationConfig : {})} />
                );
            }))}
    </svg>
);
