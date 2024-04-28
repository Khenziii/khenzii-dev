import { GitHubRepoCard, type GithubRepoCardProps } from "@khenzii-dev/ui/molecules";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: GitHubRepoCard,
    title: 'GithubRepoCard',
    tags: ['autodocs'],
};

export const Default: StoriesType<GithubRepoCardProps> = {
    args: {
        githubRepoLink: "https://github.com/Khenziii/khenz-tiktokbot/",
    },
};
