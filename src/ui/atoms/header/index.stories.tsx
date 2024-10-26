import { Header, type HeaderProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Header,
    title: 'Header',
    tags: ['autodocs'],
};

export const Default: StoriesType<HeaderProps> = {
    args: {
        children: "I'm a header!",
        fontSize: 2,
    },
};
