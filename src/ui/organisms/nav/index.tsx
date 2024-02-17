"use client"

import { type FC } from "react";
import { useMobile } from "@khenzii-dev/hooks/use_mobile";
import { NavDesktop } from "./nav_desktop";
import { NavMobile } from "./nav_mobile";
import { type iconName } from "@khenzii-dev/ui/atoms";

export type social = {
    iconName: iconName;
    url: string;
}

export type route = {
    name: string;
    path?: string;
};

export const socials: social[] = [
    {
        iconName: "Steam",
        url: "https://steamcommunity.com/id/khenzii/",
    },
    {
        iconName: "Discord",
        url: "https://discord.com/invite/5JcGp5gRkn",
    },
    {
        iconName: "Github",
        url: "https://github.com/Khenziii",
    },
    {
        iconName: "Twitter",
        url: "https://twitter.com/kheenziii",
    },
    {
        iconName: "Spotify",
        url: "https://open.spotify.com/user/31yudiyuep2e25bhirxlhavfang4",
    },
    {
        iconName: "Youtube",
        url: "https://www.youtube.com/@kheenzii",
    },
]

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
}
