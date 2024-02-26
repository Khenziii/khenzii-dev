import { Anchor, type AnchorProps } from "@khenzii-dev/ui/atoms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: Anchor,
    title: 'Anchor',
    tags: ['autodocs'],
};

export const Default: StoriesType<AnchorProps> = {
    args: {
        newTab: true,
        children: <p>I{"'"}m a child!</p>,
        href: "https://khenzii.dev/",
        darkenOnHover: true,
        prefetch: true,
    }
};
