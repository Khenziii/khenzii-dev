import { NavDesktop, type NavDesktopProps } from ".";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: NavDesktop,
    title: 'NavDesktop',
    tags: ['autodocs'],
};

export const Default: StoriesType<NavDesktopProps> = {
    args: {
        routes: [
            {
                name: "route",
                path: "#",
            },
            {
                name: "thing",
                path: "#",
            },
        ],
        socials: [
            {
                url: "#",
                iconName: "github",
            },
            {
                url: "#",
                iconName: "facebook",
            },
        ],
    },
};
