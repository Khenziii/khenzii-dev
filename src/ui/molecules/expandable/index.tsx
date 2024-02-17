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
};

export const Expandable: FC<ExpandableProps> = ({ startHeight, startWidth, endHeight, endWidth, children, openElement, closeElement, wrapOutOfFlow = false, keepOpenElementVisible = false}) => {
    const [isOpen, cycleIsOpen] = useCycle(false, true);
    const [isGrowingCompleted, setIsGrowingCompleted] = useState(false);

    const growTransition = {
        initial: {
            width: startWidth,
            height: startHeight,
        },
        animate: {
            width: endWidth,
            height: endHeight,
            transition: {
                duration:  0.5,
                ease: [0.75, 0, 0.30, 1], // cubic-bezier(0.75, 0, 0.30, 1)
            },
        },
        exit: {
            width: startWidth,
            height: startHeight,
            transition: {
                duration:  0.5,
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
                duration: 0.5,
                ease: [0.75, 0, 0.30, 1],
            },
        },
    };

    const clickHandler = useCallback(() => {
        cycleIsOpen();
    }, [cycleIsOpen]);

    useEffect(() => {
        setIsGrowingCompleted(false);
        if (!isOpen) return;

        const timer = setTimeout(() => {
            setIsGrowingCompleted(true);
        },  500); // This should match the duration of fadeInTransition

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <div className={style.container}>
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        {...growTransition}
                        className={style.wrapper}
                        style={wrapOutOfFlow ? {position: "absolute", left: 0, top: 0} : {}}
                    >
                        <motion.div
                            onClick={clickHandler}
                            {...fadeInTransition}
                            animate={isGrowingCompleted ? fadeInTransition.animate : {}}
                        >
                            {closeElement}
                        </motion.div>

                        {isGrowingCompleted && (
                            <motion.div
                                {...fadeInTransition}
                                style={{height: "100%"}}
                            >
                                {children}
                            </motion.div>
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
