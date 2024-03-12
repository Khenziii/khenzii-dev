import { type FC } from "react";
import { Loading, Paragraph } from "@khenzii-dev/ui/atoms";
import { useQuery } from "react-query";
import style from "./index.module.scss";

export type GithubAPIResponse = {
    stargazers_count: number;
};

export type GithubRepoCardProps = {
    githubRepoLink: string;
};

export const GitHubRepoCard: FC<GithubRepoCardProps> = ({ githubRepoLink }) => {
    const { data, isLoading, error } = useQuery(githubRepoLink, async (): Promise<GithubAPIResponse> => {
        // githubRepoLink should look like this: https://github.com/<user>/<repo>
        // we need to fetch this: https://api.github.com/repos/<user>/<repo>
        // this means, that we need to obtain <user> & <repo> from the original format.

        const repo = githubRepoLink.split("/")[-1];
        const username = githubRepoLink.split("/")[-2];

        if (!repo) throw new Error("Failed to get repo's name out of passed link!");
        if (!username) throw new Error("Failed to get owner user's name out of passed link!");

        const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
        return response.json();
    });

    if (isLoading) return <Loading />;
    if (error) {
        const errorMessage = (error as Error).message;
        return <Paragraph>{errorMessage}</Paragraph>;
    }

    return (
        <>
            {data && (
                <Paragraph>{data.stargazers_count}</Paragraph>
            )}
        </>
    );
};
