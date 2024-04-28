import { FadeIn, type FadeInProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: FadeIn,
    title: 'FadeIn',
    tags: ['autodocs'],
};

export const Default: StoriesType<FadeInProps> = {
    args: {
        runAnimation: true,
        children: <p>I faded in!</p>,
    },
};
