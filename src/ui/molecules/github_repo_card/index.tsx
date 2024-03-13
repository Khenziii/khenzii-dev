import { type FC, useMemo } from "react";
import { Loading, Paragraph, Flex, Anchor, Icon } from "@khenzii-dev/ui/atoms";
import { useQuery } from "@tanstack/react-query";
import style from "./index.module.scss";

export type GithubAPIResponse = {
    stargazers_count: number;
    forks_count: number;
    subscribers_count: number;
    description: string;
};

type GithubLinkInfo = {
    username: string;
    repo: string;
    /*
     * githubRepoLink, but without trailing slash
     */
    url: string;
};

export type GithubRepoCardProps = {
    githubRepoLink: string;
};

export const GitHubRepoCard: FC<GithubRepoCardProps> = ({ githubRepoLink }) => {
    const { username, repo, url } = useMemo((): GithubLinkInfo => {
        // githubRepoLink should look like this: https://github.com/<user>/<repo>
        // we need to fetch this: https://api.github.com/repos/<user>/<repo>
        // this means, that we need to obtain <user> & <repo> from the original format.

        const url = githubRepoLink.endsWith("/")
            ? githubRepoLink.slice(0, -1)
            : githubRepoLink;

        const array = url.split("/");
        const last_index = array.length - 1;
        const repo = array[last_index];
        const username = array[last_index - 1];

        if (!repo) throw new Error("Failed to get repo's name out of passed link!");
        if (!username) throw new Error("Failed to get owner user's name out of passed link!");

        return { username, repo, url };
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
                    <Anchor href={url} prefetch={false} darkenOnHover={true} newTab={true}>
                        <Paragraph fontSize={1.5}>
                            {username}/{repo}
                        </Paragraph>
                    </Anchor>

                    <Paragraph styles={{}}>{data.description}</Paragraph>

                    <Flex direction={"row"} align={"center"} className={style.statsContainer} gap={20}>
                        <div className={style.statContainer}>
                            <Anchor
                                href={`${url}/stargazers`}
                                prefetch={false}
                                className={style.iconWrapper}
                                newTab
                            >
                                <Icon iconName={"star-fill"}/>
                            </Anchor>
                            <Paragraph>{data.stargazers_count}</Paragraph>
                        </div>

                        <div className={style.statContainer}>
                            <Anchor
                                href={`${url}/forks`}
                                prefetch={false}
                                className={style.iconWrapper}
                                styles={{ rotate: "270deg" }}
                                newTab
                            >
                                <Icon iconName={"option"} />
                            </Anchor>
                            <Paragraph>{data.forks_count}</Paragraph>
                        </div>

                        <div className={style.statContainer}>
                            <Anchor
                                href={`${url}/watchers`}
                                prefetch={false}
                                className={style.iconWrapper}
                                newTab
                            >
                                <Icon iconName={"eye-fill"}/>
                            </Anchor>
                            <Paragraph>{data.subscribers_count}</Paragraph>
                        </div>
                    </Flex>
                </Flex>
            )}
        </>
    );
};
