import { type FC, type ReactNode, useState, useEffect } from "react";
import { AnimatePresence, motion, type Variants, type Transition } from "framer-motion";
import style from "./index.module.scss";
import clsx from "clsx";

export type ExpandableProps = {
    children: ReactNode;
    isExpanded: boolean;
    wrapOutOfFlow?: boolean;
    animationDuration?: number;
    inDirection?: "top-left" | "top";
    exitDirection?: "top-left" | "top";
};

export const Expandable: FC<ExpandableProps> = ({ children, isExpanded, wrapOutOfFlow = false, animationDuration = 0.5, inDirection = "top-left", exitDirection = "top-left"  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGrowingCompleted, setIsGrowingCompleted] = useState(false);

    const defaultTransition: Transition = {
        duration: animationDuration,
        ease: [0.75, 0, 0.30, 1],
    };
    const sizeTransition: Variants = {
        initial: inDirection === "top-left"
            ? {
                width: 0,
                height: 0,
            }
            : {
                width: "auto",
                height: 0,
            },
        animate: {
            width: "auto",
            height: "auto",
        },
        exit: exitDirection === "top-left"
            ? {
                width: 0,
                height: 0,
            }
            : {
                width: "auto",
                height: 0,
            },
    };
    const fadeTransition: Variants = {
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

    useEffect(() => {
        setIsGrowingCompleted(false);

        if (isExpanded) {
            setIsOpen(true);

            const timer = setTimeout(() => {
                setIsGrowingCompleted(true);
            },  animationDuration * 1000);

            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, animationDuration * 1000);

            return () => clearTimeout(timer);
        }
    }, [animationDuration, isExpanded]);

    return (
        <div className={style.container}>
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        {...sizeTransition}
                        className={clsx([style.wrapper, { [style.outOfFlow as string]: wrapOutOfFlow }])}
                        key={"expandable-aside"}
                        transition={defaultTransition}
                        layout
                    >
                        <AnimatePresence>
                            <motion.div
                                className={style.contentContainer}
                                key={"expandable-content-container"}
                                transition={defaultTransition}
                                {...fadeTransition}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
};
