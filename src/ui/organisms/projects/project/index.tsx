"use client";

import { type FC, useState } from "react";
import { Flex, Paragraph, Icon, Anchor } from "@khenzii-dev/ui/atoms";
import { Expandable, GitHubRepoCard } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";
import { type project } from "..";

export const Project: FC<project> = ({ name, description, backgroundGradient, secondaryColor, topLeftComponent, startedWorking, finishedWorking, githubRepoUrl, websiteUrl }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Flex direction={"column"} justify={"center"} gap={0} className={style.container}>
            <Flex 
                direction={"row"} 
                align={"center"} 
                fullWidth 
                className={style.title}
                styles={{ backgroundImage: backgroundGradient }}
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
                            <Icon iconName={"link-45deg"} size={3} color={secondaryColor} />
                        </Anchor>
                    )}

                    {githubRepoUrl && (
                        <Anchor href={githubRepoUrl} prefetch={false} newTab className={style.darkenChildOnHover}>
                            <Icon iconName={"github"} size={3} color={secondaryColor} />
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
                            color={secondaryColor}
                        />
                    </div>
                </Flex>
            </Flex>

            <Expandable
                startHeight={"0"}
                startWidth={"100%"}
                endHeight={""}
                endWidth={"100%"}
                animationDuration={0.75}
                autoSize={true}
                exitDirection={"top"}
                isExpanded={isExpanded}
                padding={10}
            >
                {description}

                {githubRepoUrl && (
                    <GitHubRepoCard githubRepoLink={githubRepoUrl} />
                )}
            </Expandable>
        </Flex>
    );
};
