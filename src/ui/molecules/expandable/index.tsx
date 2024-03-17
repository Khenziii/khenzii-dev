import { type FC, type ReactNode, useState, useEffect } from "react";
import { AnimatePresence, motion, type Variants, type Transition } from "framer-motion";
import style from "./index.module.scss";
import clsx from "clsx";

export type ExpandableProps = {
    startHeight: string;
    startWidth: string;
    endHeight: string;
    endWidth: string;
    children: ReactNode;
    isExpanded: boolean;
    wrapOutOfFlow?: boolean;
    animationDuration?: number;
    autoSize?: boolean;
    exitDirection?: "top-left" | "top";
};

export const Expandable: FC<ExpandableProps> = ({ startHeight, startWidth, endHeight, endWidth, children, wrapOutOfFlow = false, animationDuration = 0.5, autoSize = false, exitDirection = "top-left", isExpanded  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGrowingCompleted, setIsGrowingCompleted] = useState(false);

    const defaultTransition: Transition = {
        duration: animationDuration,
        ease: [0.75, 0, 0.30, 1],
    };
    const sizeTransition: Variants = {
        initial: {
            width: startWidth,
            height: startHeight,
        },
        animate: {
            width: endWidth,
            height: endHeight,
        },
        exit: {
            width: (exitDirection === "top-left") ? 0 : startWidth,
            height: (exitDirection === "top-left") ? 0 : startHeight,
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
                        className={clsx([style.wrapper, { [style.outOfFlow as string]: wrapOutOfFlow }])}
                        key={"expandable-aside"}
                        layout={autoSize}
                        transition={defaultTransition}
                        {...sizeTransition}
                    >
                        <AnimatePresence>
                            {(autoSize || isGrowingCompleted) && (
                                <motion.div
                                    className={style.contentContainer}
                                    key={"expandable-content-container"}
                                    transition={defaultTransition}
                                    {...fadeTransition}
                                >
                                    <motion.div key={"expandable-content"} style={{ height: "100%", width: "100%" }}>
                                        {children}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
};
