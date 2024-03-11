import { type FC, type ReactNode, useState, useEffect } from "react";
import { AnimatePresence, motion, type Variants, type Transition } from "framer-motion";
import style from "./index.module.scss";

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
            width: exitDirection === "top-left" ? 0 : startWidth,
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
                                <motion.div key={"expandable-content"}>
                                    {children}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
};
