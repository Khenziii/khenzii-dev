import { Icon, type IconProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Icon,
    title: 'Icon',
    tags: ['autodocs'],
};

export const Default: StoriesType<IconProps> = {
    args: {
        iconName: "github",
        size: 2,
        color: "#000000",
    },
};
