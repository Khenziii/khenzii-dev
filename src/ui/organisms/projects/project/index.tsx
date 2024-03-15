"use client";

import { type FC, useState } from "react";
import { Flex, Paragraph, Icon, Anchor } from "@khenzii-dev/ui/atoms";
import { Expandable, GitHubRepoCard } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";
import { type project } from "..";

const formatDate = (date?: Date): string => {
    if (date === undefined) return "...";

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${year}`;
};

export const Project: FC<project> = ({ name, description, backgroundGradient, topLeftComponent, startedWorking, finishedWorking, githubRepoUrl, websiteUrl, role }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Flex direction={"column"} justify={"center"} gap={0} className={style.container}>
            <Flex direction={"column"} justify={"center"} gap={0} fullWidth className={style.title}>
                <Flex
                    direction={"row"}
                    align={"center"}
                    fullWidth
                    gap={10}
                >
                    <Flex direction={"row"} justify={"flex-start"} align={"center"}>
                        {topLeftComponent}

                        <Paragraph fontSize={2} styles={{ whiteSpace: "nowrap" }}>
                            {name}
                        </Paragraph>
                    </Flex>

                    <Flex
                        direction={"row"}
                        justify={"flex-end"}
                        align={"center"}
                        gap={20}
                        fullWidth
                    >
                        {websiteUrl && (
                            <Anchor href={websiteUrl} prefetch={false} newTab className={style.darkenChildOnHover}>
                                <Icon iconName={"link-45deg"} size={3} />
                            </Anchor>
                        )}

                        {githubRepoUrl && (
                            <Anchor href={githubRepoUrl} prefetch={false} newTab className={style.darkenChildOnHover}>
                                <Icon iconName={"github"} size={3} />
                            </Anchor>
                        )}

                        <div
                            className={style.darkenChildOnHover}
                            onClick={() => setIsExpanded((e) => !e)}
                        >
                            <Icon
                                iconName={
                                    isExpanded
                                        ? "arrow-up-short"
                                        : "arrow-down-short"
                                }
                                size={3}
                            />
                        </div>
                    </Flex>
                </Flex>

                <div className={style.underline} style={{ backgroundImage: backgroundGradient, height: "10px" }} />
            </Flex>

            <Expandable
                startHeight={"0"}
                startWidth={"calc(100% - 1px * 2)"} // 1px * 2 - borders
                endHeight={""}
                endWidth={"calc(100% - 1px * 2)%"}
                animationDuration={0.75}
                autoSize={true}
                exitDirection={"top"}
                isExpanded={isExpanded}
            >
                <Flex direction={"column"} styles={{ padding: "10px", boxSizing: "border-box" }}>
                    <Flex direction={"row"} align={"center"} gap={5}>
                        <Icon iconName={"clock"} size={1} />
                        <Paragraph>
                            {`${formatDate(startedWorking)} - ${formatDate(finishedWorking)}`}
                        </Paragraph>
                    </Flex>

                    {role && (
                        <Paragraph>Role: {role}</Paragraph>
                    )}

                    {description}

                    {githubRepoUrl && (
                        <GitHubRepoCard githubRepoLink={githubRepoUrl} />
                    )}
                </Flex>
            </Expandable>
        </Flex>
    );
};
