import { Logo, type LogoProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Logo,
    title: 'Logo',
    tags: ['autodocs'],
};

export const Default: StoriesType<LogoProps> = {
    args: {
        size: 100,
        animate: true,
    },
};
