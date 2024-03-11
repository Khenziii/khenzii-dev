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
    const [isShrinkingCompleted, setIsShrinkingCompleted] = useState(true);

    const defaultTransition = {
        duration: animationDuration,
        ease: [0.75, 0, 0.30, 1],
    };
    const sizeTransition = {
        initial: {
            width: startWidth,
            height: startHeight,
        },
        animate: {
            width: endWidth,
            height: endHeight,
        },
        exit: {
            width: exitDirection === "top-left" ? 0 : startWidth,
            height: 0,
        },
    };

    const fadeTransition = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: isGrowingCompleted ? 1 : 0,
        },
        exit: {
            opacity: 0,
        },
    };


    const open = useCallback(() => {
        setIsOpen(true);
        setIsShrinkingCompleted(false);

        const timer = setTimeout(() => {
            setIsGrowingCompleted(true);
        },  animationDuration * 1000);

        return () => clearTimeout(timer);
    }, [animationDuration]);

    const close = useCallback(() => {
        setIsGrowingCompleted(false);

        const first_timer = setTimeout(() => {
            setIsOpen(false);
        }, animationDuration * 1000);

        const second_timer = setTimeout(() => {
            setIsShrinkingCompleted(true);
        }, animationDuration * 1000 * 2);

        return () => {
            clearTimeout(first_timer);
            clearTimeout(second_timer);
        };
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
                        transition={defaultTransition}
                    >
                        <AnimatePresence>
                            <motion.div
                                className={style.contentContainer}
                                key={"expandable-content-container"}
                                transition={defaultTransition}
                                {...fadeTransition}
                            >
                                <motion.div onClick={close} key={"expandable-content-close"}>
                                    {closeElement}
                                </motion.div>

                                <motion.div style={{ flex: "1" }} key={"expandable-content"}>
                                    {children}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.aside>
                )}
            </AnimatePresence>
            {(isShrinkingCompleted || keepOpenElementVisible) && (
                <div onClick={open} style={{ height: "100%" }}>
                    {openElement}
                </div>
            )}
        </div>
    );
};
