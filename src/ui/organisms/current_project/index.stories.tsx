import { CurrentProject, type CurrentProjectProps } from "@khenzii-dev/ui/organisms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: CurrentProject,
    title: 'CurrentProject',
    tags: ['autodocs'],
};

export const Default: StoriesType<CurrentProjectProps> = {
    args: {
        fontSize: 1.25,
        loadingSize: 100,
    },
};
