"use client";

import { type FC, type ReactNode, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    autoSize?: boolean;
    exitDirection?: "top-left" | "top";
};

export const Expandable: FC<ExpandableProps> = ({ startHeight, startWidth, endHeight, endWidth, children, openElement, closeElement, wrapOutOfFlow = false, keepOpenElementVisible = false, animationDuration = 0.5, autoSize = false, exitDirection = "top-left" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGrowingCompleted, setIsGrowingCompleted] = useState(false);


    const sizeTransition = {
        initial: autoSize 
            ? {} 
            : {
                width: startWidth,
                height: startHeight,
            },
        animate: autoSize 
            ? {
                transition: {
                    duration: animationDuration,
                    ease: [0.75, 0, 0.30, 1], // cubic-bezier(0.75, 0, 0.30, 1)
                },
            }
            : {
                width: endWidth,
                height: endHeight,
                transition: {
                    duration: animationDuration,
                    ease: [0.75, 0, 0.30, 1], // cubic-bezier(0.75, 0, 0.30, 1)
                },
            },
        exit: {
            width: exitDirection === "top-left" ? 0 : startWidth,
            height: 0,
            transition: {
                duration: animationDuration,
                ease: [0.75, 0, 0.30, 1],
            },
        },
    };

    const fadeTransition = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
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
        },
    };


    const open = useCallback(() => {
        setIsOpen(true);

        const timer = setTimeout(() => {
            setIsGrowingCompleted(true);
        },  animationDuration * 1000);

        return () => clearTimeout(timer);
    }, [animationDuration]);

    const close = useCallback(() => {
        setIsGrowingCompleted(false);

        const timer = setTimeout(() => {
            setIsOpen(false);
        }, animationDuration * 1000);

        return () => clearTimeout(timer);
    }, [animationDuration]);

    return (
        <div className={style.container}>
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        {...sizeTransition}
                        className={style.wrapper}
                        style={wrapOutOfFlow ? { position: "absolute", left: 0, top: 0 } : {}}
                        key={"expandable-aside"}
                        layout={autoSize ? true : undefined}
                    >
                        <AnimatePresence>
                            {isGrowingCompleted && (
                                <motion.div {...fadeTransition} className={style.contentContainer} key={"expandable-content-container"}>
                                    <motion.div onClick={close} key={"expandable-content-close"}>
                                        {closeElement}
                                    </motion.div>

                                    <motion.div style={{ flex: "1" }} key={"expandable-content"}>
                                        {children}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.aside>
                )}
            </AnimatePresence>
            {(!isOpen || keepOpenElementVisible) && (
                <div onClick={open} style={{ height: "100%" }}>
                    {openElement}
                </div>
            )}
        </div>
    );
};
