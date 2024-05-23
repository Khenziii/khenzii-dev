"use client";

import { type FC, memo, useEffect, useState } from "react";
import { type position, type SvgData } from "@khenzii-dev/ui/types";
import { motion } from "framer-motion";
import style from "./index.module.scss";

const animationDelay = 0.25;
const amountOfTilesAtOnce = 3;
const tileVariants = {
    hidden: { visibility: "hidden" },
    visible: { visibility: "visible" },
} as const;
const loadingData: SvgData = [
    {
        wrapperName: "left-line",
        squares: [
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
            { x: 3, y: 1 },
            { x: 3, y: 2 },
            { x: 3, y: 3 },
            { x: 2, y: 3 },
            { x: 1, y: 3 },
            { x: 0, y: 3 },
            { x: 0, y: 2 },
        ],
    },
    {
        wrapperName: "right-line",
        squares: [
            { x: 3, y: 2 },
            { x: 3, y: 3 },
            { x: 2, y: 3 },
            { x: 1, y: 3 },
            { x: 0, y: 3 },
            { x: 0, y: 2 },
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
            { x: 3, y: 1 },
        ],
    },
] as const;


type MemoizedRectProps = {
    x: number;
    y: number;
    visibility: string;
};

const MemoizedRect: FC<MemoizedRectProps> = memo(({ x, y, visibility }) => (
    <motion.rect
        x={x}
        y={y}
        width="1"
        height="1"
        className={style.tile}
        variants={tileVariants}
        initial={visibility}
        animate={visibility}
    />
));
MemoizedRect.displayName = "LoadingMemoizedRect";


export type LoadingProps = {
    size?: number;
};

export const Loading: FC<LoadingProps> = ({ size =  100 }) => {
    const [visiblePositions, setVisiblePositions] = useState<position[]>([]);
    const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

    useEffect(() => {
        let newPositions: position[] = [];
        loadingData.map((wrapper) => {
            const squares = visibleIndexes.map((index) => wrapper.squares[index]!);
            newPositions = [...newPositions, ...squares];
        });

        setVisiblePositions(newPositions);
    }, [visibleIndexes]);

	useEffect(() => {
		const timer = setInterval(() => {
            setVisibleIndexes((currentVisibleIndexes) => {
                const lastVisibleIndex = currentVisibleIndexes[currentVisibleIndexes.length - 1];
                let nextIndex = (lastVisibleIndex ?? -1) + 1;

                if (nextIndex >= loadingData[0]!.squares.length) {
                    nextIndex = 0;
                }

                const newIndexes = [...currentVisibleIndexes];
                newIndexes.push(nextIndex);

                if (newIndexes.length > amountOfTilesAtOnce) {
                    newIndexes.shift(); // removes first element
                }

                return newIndexes;
            });

        }, animationDelay * 1000);

        return () => clearInterval(timer);
	}, []);

    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 4 4'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            {loadingData.map((wrapper) =>
                wrapper.squares.map((squareSet, index) => {
                    const isVisible = visiblePositions.includes(squareSet);
                    const visibility = isVisible ? "visible" : "hidden";

                    return (
                        <MemoizedRect
                            key={`${wrapper.wrapperName}-${index}`}
                            x={squareSet.x}
                            y={squareSet.y}
                            visibility={visibility}
                        />
                    );
                }))}
        </svg>
    );
};
