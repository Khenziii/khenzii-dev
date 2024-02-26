import { NavDesktopItem, type NavDesktopItemProps } from ".";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: NavDesktopItem,
    title: 'NavDesktopItem',
    tags: ['autodocs'],
};

export const Default: StoriesType<NavDesktopItemProps> = {
    args: {
        route: {
            name: "route",
            path: "#",
        },
        active: true,
    },
};
