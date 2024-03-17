"use client";

import { type FC, useState } from "react";
import { Flex, Paragraph, Icon, Anchor } from "@khenzii-dev/ui/atoms";
import { Expandable, GitHubRepoCard } from "@khenzii-dev/ui/molecules";
import { useMobile } from "@khenzii-dev/hooks";
import style from "./index.module.scss";
import { type project } from "..";

const formatDates = (dates: project["dates"]): string => {
    if (dates === undefined) return "";

    return dates.map((entry): string => {
        return `${formatDate(entry[0])} - ${formatDate(entry[1])}`;
    }).join(", ");
};

const formatDate = (date?: Date): string => {
    if (date === undefined) return "...";

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${year}`;
};

export const Project: FC<project> = ({ name, description, backgroundGradient, topLeftComponent, dates, githubRepoUrl, websiteUrl, role }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const mobile = useMobile(500);

    return (
        <Flex direction={"column"} justify={"center"} gap={0} className={style.container}>
            <Flex direction={"column"} justify={"center"} gap={0} fullWidth className={style.title}>
                <Flex
                    direction={mobile ? "column" : "row"}
                    align={mobile ? "flex-start" : "center"}
                    fullWidth
                    gap={10}
                >
                    <Flex direction={"row"} justify={"flex-start"} align={"center"} fullWidth>
                        {topLeftComponent}

                        <Paragraph fontSize={2} styles={{ width: "100%" }}>
                            {name}
                        </Paragraph>
                    </Flex>

                    <Flex
                        direction={mobile ? "row-reverse" : "row"}
                        align={"center"}
                        gap={20}
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
                isExpanded={isExpanded}
                animationDuration={0.75}
                inDirection={"top"}
                exitDirection={"top"}
            >
                <Flex direction={"column"} className={style.expandContainer}>
                    {dates && (
                        <Flex direction={"row"} align={"center"} gap={5} className={style.darkenChild}>
                            <Icon iconName={"clock"} size={1} />
                            <Paragraph>{formatDates(dates)}</Paragraph>
                        </Flex>
                    )}

                    {role && (
                        <div className={style.darkenChild}>
                            <Paragraph>Role: {role}</Paragraph>
                        </div>
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
