import { Project, type ProjectProps } from "@khenzii-dev/ui/molecules";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";
import { Icon } from "@khenzii-dev/ui/atoms";

export default {
    component: Project,
    title: 'Project',
    tags: ['autodocs'],
};

export const Default: StoriesType<ProjectProps> = {
    args: {
        name: "khenzii.dev",
        description: "The very project that you're working on right now!",
        backgroundColor: "#000000",
        githubRepoUrl: "https://github.com/Khenziii/khenzii-dev",
        websiteUrl: "https://khenzii.dev/",
        startedWorking: new Date(new Date().getTime() - 1000 * 60 * 60),
        finishedWorking: new Date(),
        topLeftComponent: <Icon iconName={"globe2"} size={2} />,
    },
};
