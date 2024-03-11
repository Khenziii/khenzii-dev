"use client";

import { type FC, type ReactNode, useState } from "react";
import { Flex, Paragraph, Icon } from "@khenzii-dev/ui/atoms";
import { Expandable } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";
import clsx from "clsx";

export type ProjectProps = {
    name: string;
    description: string;
    backgroundGradient: string;
    secondaryColor: string;
    topLeftComponent: ReactNode;
    startedWorking: Date;
    finishedWorking?: Date;
    githubRepoUrl?: string;
    websiteUrl?: string;
};

export const Project: FC<ProjectProps> = ({ name, description, backgroundGradient, secondaryColor, topLeftComponent, startedWorking, finishedWorking, githubRepoUrl, websiteUrl }) => {
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
                <Flex direction={"row"} justify={"flex-start"} align={"center"}>
                    {topLeftComponent}

                    <Paragraph fontSize={2}>
                        {name}
                    </Paragraph>
                </Flex>

                <Flex direction={"row"} justify={"flex-end"} align={"center"}>
                    <div
                        className={clsx(
                            [style.openWrapper],
                            { [style.pointingUp as string]: isExpanded },
                            { [style.pointingDown as string]: !isExpanded },
                        )}
                        onClick={() => setIsExpanded((e) => !e)}
                        style={
                            isExpanded
                                ? { transform: "rotate(180deg)" }
                                : {}
                        }
                    >
                        <Icon
                            iconName={"arrow-down-short"}
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
                wrapOutOfFlow={true}
                isExpanded={isExpanded}
            >
                <div style={{ height: "50vh" }}>
                    <Paragraph>{description}</Paragraph>
                </div>
            </Expandable>
        </Flex>
    );
};
