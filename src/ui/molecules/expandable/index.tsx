"use client"

import { type FC, type ReactNode, useCallback, useEffect, useState } from "react";
import { useCycle, AnimatePresence, motion } from "framer-motion";
import style from "./index.module.scss";

export type ExpandableProps = {
    startHeight: string;
    startWidth: string;
    endHeight: string;
    endWidth: string;
    children: ReactNode;
    openElement: ReactNode;
    closeElement: ReactNode;
    wrapOutOfFlow?: boolean;
    keepOpenElementVisible?: boolean;
    animationDuration?: number;
};

export const Expandable: FC<ExpandableProps> = ({ startHeight, startWidth, endHeight, endWidth, children, openElement, closeElement, wrapOutOfFlow = false, keepOpenElementVisible = false, animationDuration = 0.5}) => {
    const [isOpen, cycleIsOpen] = useCycle(false, true);
    const [isGrowingCompleted, setIsGrowingCompleted] = useState(false);
    const [isFadingOutCompleted, setIsFadingOutCompleted] = useState(false);

    const growTransition = {
        initial: {
            width: startWidth,
            height: startHeight,
        },
        animate: {
            width: endWidth,
            height: endHeight,
            transition: {
                duration:  animationDuration,
                ease: [0.75, 0, 0.30, 1], // cubic-bezier(0.75, 0, 0.30, 1)
            },
        },
        exit: {
            width: startWidth,
            height: startHeight,
            transition: {
                duration:  animationDuration,
                ease: [0.75, 0, 0.30, 1],
            },
        },
    };

    const fadeInTransition = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity:  1,
            transition: {
                duration: animationDuration,
                ease: [0.75, 0, 0.30, 1],
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: animationDuration,
                ease: [0.75, 0, 0.30, 1],
            },
        }
    };

    const clickHandler = useCallback(() => {
        cycleIsOpen();
    }, [cycleIsOpen]);

    useEffect(() => {
        if (isOpen) {
            setIsGrowingCompleted(false);

            const timer = setTimeout(() => {
                setIsGrowingCompleted(true);
            },  animationDuration * 1000);

            return () => clearTimeout(timer);
        } else {
            setIsFadingOutCompleted(false);

            const timer = setTimeout(() => {
                setIsFadingOutCompleted(true);
            },  animationDuration * 1000);

            return () => clearTimeout(timer);
        }
    }, [animationDuration, isOpen]);

    return (
        <div className={style.container}>
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        {...growTransition}
                        exit={isFadingOutCompleted ? growTransition.exit : {}}
                        className={style.wrapper}
                        style={wrapOutOfFlow ? {position: "absolute", left: 0, top: 0} : {}}
                    >
                        {isGrowingCompleted && (
                            <>
                                <motion.div
                                    onClick={clickHandler}
                                    {...fadeInTransition}
                                >
                                    {closeElement}
                                </motion.div>

                                <motion.div
                                    {...fadeInTransition}
                                    style={{height: "100%"}}
                                >
                                    {children}
                                </motion.div>
                            </>
                        )}
                    </motion.aside>
                )}
            </AnimatePresence>
            {(!isOpen || keepOpenElementVisible) && (
                <div onClick={clickHandler} style={{height: "100%"}}>
                    {openElement}
                </div>
            )}
        </div>
    );
}
