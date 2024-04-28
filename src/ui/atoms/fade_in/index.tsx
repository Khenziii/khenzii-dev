"use client";

import { type FC, type ReactNode, useEffect, useState } from "react";
import style from "./index.module.scss";
import clsx from "clsx";

export type FadeInProps = {
    children: ReactNode;
    runAnimation?: boolean;
};

export const FadeIn: FC<FadeInProps> = ({ children, runAnimation = false }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(runAnimation);
    }, [runAnimation]);

    return (
        <div
            className={clsx([style.animate], {
                [style.active as string]: active,
            })}
        >
            {children}
        </div>
    );
};
