"use client"

import { type FC } from "react";
import { useMobile } from "@khenzii-dev/hooks/use_mobile";
import { NavDesktop } from "./nav_desktop";
import { NavMobile } from "./nav_mobile";

export type route = {
    name: string;
    path: string;
};

export const routes: route[] = [
    {
        name: "home",
        path: "/",
    },
    {
        name: "projects",
        path: "/projects",
    },
    {
        name: "about",
        path: "/about",
    },
    {
        name: "blog",
        path: "/blog",
    },
];

export type NavProps = {};

export const Nav: FC<NavProps> = ({}) => {
    const mobile = useMobile();

    return (
        <>
            {mobile ? <NavMobile routes={routes} /> : <NavDesktop routes={routes} />}
        </>
    );
}
