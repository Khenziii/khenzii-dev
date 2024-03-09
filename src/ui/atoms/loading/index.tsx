"use client";

import { type FC, memo, useCallback, useEffect, useState } from "react";
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
    const [currentIndexes, setCurrentIndexes] = useState(loadingData.map(() => 0));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndexes((prevIndexes) => {
                return prevIndexes.map((previousIndex, index) => {
                    if (previousIndex + 1 >= loadingData[index]!.squares.length) {
                        return 0;
                    }

                    return previousIndex + 1;
                });
            });
        }, animationDelay *  1000);

        return () => clearInterval(timer);
    }, []);

    /*
     * shows a square if it's hidden & hides if it's currently visible
     */
    const modifyState = useCallback((square: position) => {
        setVisiblePositions((prevVisiblePositions) => {
            if (prevVisiblePositions.some((pos) => pos.x === square.x && pos.y === square.y)) {
                return prevVisiblePositions.filter((pos) => pos.x !== square.x || pos.y !== square.y);
            } else {
                return [...prevVisiblePositions, square];
            }
        });
    }, []);

    useEffect(() => {
        const newSquares = currentIndexes.map((squareIndex, index) => loadingData[index]!.squares[squareIndex]);
        newSquares.forEach((square) => {
           if (square === undefined) return;
           modifyState(square);
        });

        const oldestSquares = currentIndexes.map((squareIndex, index) => {
            const squares = loadingData[index]!.squares;
            const updatedSquareIndex = (squareIndex - amountOfTilesAtOnce + squares.length) % squares.length;

            return squares[updatedSquareIndex];
        });
        oldestSquares.forEach((square) => {
            if (square === undefined || !visiblePositions.includes(square)) return;

            modifyState(square);
        });
    }, [currentIndexes]);

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
