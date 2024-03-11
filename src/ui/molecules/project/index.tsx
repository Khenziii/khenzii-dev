import { type FC, type ReactNode } from "react";
import { Flex, Paragraph } from "@khenzii-dev/ui/atoms";
import { Expandable } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";
import clsx from "clsx";

export type ProjectProps = {
    name: string;
    description: string;
    backgroundColor: string;
    topLeftComponent: ReactNode;
    startedWorking: Date;
    finishedWorking?: Date;
    githubRepoUrl?: string;
    websiteUrl?: string;
};

export const Project: FC<ProjectProps> = ({ name, description, backgroundColor, topLeftComponent, startedWorking, finishedWorking, githubRepoUrl, websiteUrl }) => {


    return (
        <Flex direction={"column"} justify={"center"} fullWidth>
            <Flex direction={"row"} align={"center"} fullWidth className={style.title}>
                {topLeftComponent}

                <Paragraph fontSize={2}>
                    {name}
                </Paragraph>
            </Flex>

            <Expandable
                startHeight={"0"}
                startWidth={"100%"}
                endHeight={""}
                endWidth={"100%"}
                openElement={
                    <Paragraph>open element</Paragraph>
                }
                closeElement={
                    <Paragraph>close element</Paragraph>
                }
                animationDuration={0.75}
                autoSize={true}
                exitDirection={"top"}
            >
                <div style={{ height: "50vh" }}>
                    <p>something</p>
                </div>
            </Expandable>
        </Flex>
    );
};
