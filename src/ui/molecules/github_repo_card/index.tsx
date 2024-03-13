import { type FC, useMemo } from "react";
import { Loading, Paragraph, Flex, Anchor } from "@khenzii-dev/ui/atoms";
import { useQuery } from "@tanstack/react-query";
import style from "./index.module.scss";

export type GithubAPIResponse = {
    stargazers_count: number;
    forks_count: number;
    subscribers_count: number;
};

type GithubLinkInfo = {
    username: string;
    repo: string;
};

export type GithubRepoCardProps = {
    githubRepoLink: string;
};

export const GitHubRepoCard: FC<GithubRepoCardProps> = ({ githubRepoLink }) => {
    const { username, repo } = useMemo((): GithubLinkInfo => {
        // githubRepoLink should look like this: https://github.com/<user>/<repo>
        // we need to fetch this: https://api.github.com/repos/<user>/<repo>
        // this means, that we need to obtain <user> & <repo> from the original format.

        const array = githubRepoLink.split("/");
        let last_index = array.length - 1;

        if (githubRepoLink.endsWith("/")) last_index -= 1;

        const repo = array[last_index];
        const username = array[last_index - 1];

        if (!repo) throw new Error("Failed to get repo's name out of passed link!");
        if (!username) throw new Error("Failed to get owner user's name out of passed link!");

        return { username, repo };
    }, [githubRepoLink]);

    const { isLoading, error, data } = useQuery({
        queryKey: [githubRepoLink],
        queryFn: async (): Promise<GithubAPIResponse> => {
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
            return (await response.json()) as unknown as GithubAPIResponse;
        },
    });

    if (isLoading) return <Loading size={100} />;
    if (error) {
        const errorMessage = error.message;
        return <Paragraph>{errorMessage}</Paragraph>;
    }

    return (
        <>
            {data && (
                <Flex direction={"column"} justify={"center"} className={style.container}>
                    <Anchor href={githubRepoLink} prefetch={false} darkenOnHover={true} newTab={true}>
                        {username}/{repo}
                    </Anchor>
                </Flex>
            )}
        </>
    );
};
