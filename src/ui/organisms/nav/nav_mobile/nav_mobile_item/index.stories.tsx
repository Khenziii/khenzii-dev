import { NavMobileItem, type NavMobileItemProps } from ".";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: NavMobileItem,
    title: 'NavMobileItem',
    tags: ['autodocs'],
};

export const Default: StoriesType<NavMobileItemProps> = {
    args: {
        route: {
            name: "route",
            path: "#",
        },
        active: true,
    },
};
