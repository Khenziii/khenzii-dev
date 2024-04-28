import { NavMobile, type NavMobileProps } from ".";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: NavMobile,
    title: 'NavMobile',
    tags: ['autodocs'],
};

export const Default: StoriesType<NavMobileProps> = {
    args: {
        routes: [
            {
                name: "route",
                path: "#",
            },
            {
                name: "stuff",
                path: "#",
            },
        ],
        socials: [
            {
                url: "#",
                iconName: "youtube",
            },
            {
                url: "#",
                iconName: "instagram",
            },
        ],
    },
};
