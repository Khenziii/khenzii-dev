"use client";

import { useState, useEffect } from 'react';

// if you wish to update this, please update
// $mobileWidth in src/styles/constants.scss too
const MOBILE_WIDTH = 1200;

export const useMobile = (customWidth?: number) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkWidthAndUpdateState = () => {
            setIsMobile(window.innerWidth <= (customWidth ?? MOBILE_WIDTH));
        };

        checkWidthAndUpdateState();

        window.addEventListener("resize", checkWidthAndUpdateState);
        return () => window.removeEventListener("resize", checkWidthAndUpdateState);
    }, [customWidth]);

    return isMobile;
};
