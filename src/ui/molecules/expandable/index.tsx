"use client"

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
};

export const Expandable: FC<ExpandableProps> = ({ startHeight, startWidth, endHeight, endWidth, children, openElement, closeElement, wrapOutOfFlow = false, keepOpenElementVisible = false, animationDuration = 0.5}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGrowingCompleted, setIsGrowingCompleted] = useState(false);


    const sizeTransition = {
        initial: {
            width: startWidth,
            height: startHeight,
        },
        animate: {
            width: endWidth,
            height: endHeight,
            transition: {
                duration: animationDuration,
                ease: [0.75, 0, 0.30, 1], // cubic-bezier(0.75, 0, 0.30, 1)
            },
        },
        exit: {
            width: 0,
            height: 0,
            transition: {
                duration: animationDuration,
                ease: [0.75, 0, 0.30, 1],
            },
        },
    };

    const fadeTransition = {
        initial: {
            opacity: 0
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
        }
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
                        style={wrapOutOfFlow ? {position: "absolute", left: 0, top: 0} : {}}
                        key={"nav-mobile-socials-aside"}
                    >
                        <AnimatePresence>
                            {isGrowingCompleted && (
                                <motion.div {...fadeTransition} style={{height: "100%"}} key={"nav-mobile-socials-container"}>
                                    <motion.div onClick={close} key={"nav-mobile-socials-close"}>
                                        {closeElement}
                                    </motion.div>

                                    <motion.div style={{height: "100%"}} key={"nav-mobile-socials-list"}>
                                        {children}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.aside>
                )}
            </AnimatePresence>
            {(!isOpen || keepOpenElementVisible) && (
                <div onClick={open} style={{height: "100%"}}>
                    {openElement}
                </div>
            )}
        </div>
    );
}
