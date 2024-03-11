"use client";

import { type FC, type ReactNode, useState } from "react";
import { Flex, Paragraph, Tooltip, Icon } from "@khenzii-dev/ui/atoms";
import { Expandable } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";

export type ProjectProps = {
    name: string;
    description: string;
    backgroundGradient: string;
    topLeftComponent: ReactNode;
    startedWorking: Date;
    finishedWorking?: Date;
    githubRepoUrl?: string;
    websiteUrl?: string;
};

export const Project: FC<ProjectProps> = ({ name, description, backgroundGradient, topLeftComponent, startedWorking, finishedWorking, githubRepoUrl, websiteUrl }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Flex direction={"column"} justify={"center"} gap={0} fullWidth>
            <Flex 
                direction={"row"} 
                align={"center"} 
                fullWidth 
                className={style.title}
                styles={{ backgroundImage: backgroundGradient }}
                gap={10}
            >
                {topLeftComponent}

                <Paragraph fontSize={2}>
                    {name}
                </Paragraph>
            </Flex>

            <Flex
                direction={"row"}
                align={"center"}
                gap={10}
                fullWidth
            >
                {!isExpanded && (
                    <Tooltip
                        tooltip={
                            <Paragraph>Click to see more!</Paragraph>
                        }
                        transitionDelay={0.75}
                    >
                        <div className={style.openWrapper} onClick={() => setIsExpanded((e) => !e)}>
                            <Icon iconName={"arrow-right-short"} size={3} />
                        </div>
                    </Tooltip>
                )}
            </Flex>

            <Expandable
                startHeight={"0"}
                startWidth={"100%"}
                endHeight={""}
                endWidth={"100%"}
                animationDuration={0.75}
                autoSize={true}
                exitDirection={"top"}
                wrapOutOfFlow={true}
                isExpanded={isExpanded}
            >
                <div style={{ height: "50vh" }}>
                    <p>something</p>
                </div>
            </Expandable>
        </Flex>
    );
};
