import { Header, type HeaderProps } from "@khenzii-dev/ui/atoms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: Header,
    title: 'Header',
    tags: ['autodocs'],
};

export const Default: StoriesType<HeaderProps> = {
    args: {
        text: "I'm a header!",
        fontsize: 2,
    },
};
