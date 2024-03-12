import { Project, type ProjectProps } from "@khenzii-dev/ui/organisms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";
import { Icon, Paragraph } from "@khenzii-dev/ui/atoms";

export default {
    component: Project,
    title: 'Project',
    tags: ['autodocs'],
};

export const Default: StoriesType<ProjectProps> = {
    args: {
        name: "khenzii.dev",
        description: <Paragraph>The very project that you{"'"}re working on right now!</Paragraph>,
        backgroundGradient: "linear-gradient(270deg, #FFFFFF, #20201f)",
        secondaryColor: "#20201f",
        githubRepoUrl: "https://github.com/Khenziii/khenzii-dev",
        websiteUrl: "https://khenzii.dev/",
        startedWorking: new Date(new Date().getTime() - 1000 * 60 * 60),
        finishedWorking: new Date(),
        topLeftComponent: <Icon iconName={"globe2"} size={2} />,
    },
};
