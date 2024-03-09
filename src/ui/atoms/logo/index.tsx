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
            { x: 5, y: 5 },
            { x: 5, y: 4 },
            { x: 4, y: 5 },
            { x: 5, y: 3 },
            { x: 3, y: 5 },
            { x: 5, y: 2 },
            { x: 4, y: 3 },
            { x: 5, y: 1 },
            { x: 3, y: 3 },
            { x: 4, y: 1 },
            { x: 3, y: 1 },
        ],
    },
    {
        wrapperName: "a",
        squares: [
            { x: 7, y: 5 },
            { x: 7, y: 4 },
            { x: 7, y: 3 },
            { x: 8, y: 4 },
            { x: 7, y: 2 },
            { x: 9, y: 4 },
            { x: 8, y: 2 },
            { x: 9, y: 5 },
            { x: 8, y: 1 },
            { x: 9, y: 3 },
            { x: 9, y: 2 },
        ],
    },
    {
        wrapperName: "two",
        squares: [
            { x: 4, y: 7 },
            { x: 5, y: 8 },
            { x: 3, y: 7 },
            { x: 4, y: 9 },
            { x: 3, y: 10 },
            { x: 3, y: 11 },
            { x: 4, y: 11 },
            { x: 5, y: 11 },
        ],
    },
    {
        wrapperName: "nine",
        squares: [
            { x: 7, y: 7 },
            { x: 8, y: 7 },
            { x: 7, y: 8 },
            { x: 9, y: 7 },
            { x: 7, y: 9 },
            { x: 9, y: 8 },
            { x: 8, y: 9 },
            { x: 9, y: 9 },
            { x: 9, y: 10 },
            { x: 9, y: 11 },
            { x: 8, y: 11 },
            { x: 7, y: 11 },
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
        width={size}
        height={size}
        viewBox='0 0 13 13'
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
