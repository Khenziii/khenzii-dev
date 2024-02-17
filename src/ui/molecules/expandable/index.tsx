"use client"

import { type FC, type ReactNode, useCallback } from "react";
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

    const transition = {
        initial: {
            width: startWidth,
            height: startHeight,
        },
        animate: {
            width: endWidth,
            height: endHeight,
        },
        exit: {
            width: startWidth,
            height: startHeight,
            transition: {
                duration: 0.3,
            },
        },
    };

    const clickHandler = useCallback(() => {
        cycleIsOpen();
    }, [cycleIsOpen]);

    return (
        <div className={style.container}>
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        {...transition}
                        className={style.wrapper}
                        style={wrapOutOfFlow ? {position: "absolute", left: 0, top: 0} : {}}
                    >
                        <div onClick={clickHandler}>
                            {closeElement}
                        </div>

                        {children}
                    </motion.aside>
                )}
            </AnimatePresence>
            {(!isOpen || keepOpenElementVisible) && (
                <div onClick={clickHandler}>
                    {openElement}
                </div>
            )}
        </div>
    );
}
