"use client";

import { type FC } from "react";
import { useMobile } from "@khenzii-dev/hooks/use_mobile";
import { NavDesktop } from "./nav_desktop";
import { NavMobile } from "./nav_mobile";
import type { IconName } from "@khenzii-dev/ui/types";

export type social = {
    iconName: IconName;
    url: string;
};

export type route = {
    name: string;
    path?: string;
};

export const socials: social[] = [
    {
        iconName: "steam",
        url: "https://steamcommunity.com/id/khenzii/",
    },
    {
        iconName: "discord",
        url: "https://discord.com/invite/5JcGp5gRkn",
    },
    {
        iconName: "github",
        url: "https://github.com/Khenziii",
    },
    {
        iconName: "twitter",
        url: "https://twitter.com/kheenziii",
    },
    {
        iconName: "spotify",
        url: "https://open.spotify.com/user/31yudiyuep2e25bhirxlhavfang4",
    },
    {
        iconName: "youtube",
        url: "https://www.youtube.com/@kheenzii",
    },
];

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
        name: "blog",
        path: "/blog",
    },
];

// export type NavProps = {};

export const Nav: FC = () => {
    const mobile = useMobile();

    return (
        <>
            {mobile ? <NavMobile routes={routes} socials={socials} /> : <NavDesktop routes={routes} socials={socials} />}
        </>
    );
};
