import { Loading, type LoadingProps } from "@khenzii-dev/ui/atoms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: Loading,
    title: 'Loading',
    tags: ['autodocs'],
};

export const Default: StoriesType<LoadingProps> = {
    args: {
        size: 100,
    },
};
