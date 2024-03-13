import { ReactQueryProvider } from "@khenzii-dev/providers";
import { GitHubRepoCard, type GithubRepoCardProps } from "@khenzii-dev/ui/molecules";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: GitHubRepoCard,
    title: 'GithubRepoCard',
    tags: ['autodocs'],
};

export const Default: StoriesType<GithubRepoCardProps> = {
    args: {
        githubRepoLink: "https://github.com/khenziii/khenz-tiktokbot/",
    },
    decorators: [(Story) => <ReactQueryProvider><Story /></ReactQueryProvider>],
};
