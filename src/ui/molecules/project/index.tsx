import { type FC, type ReactNode } from "react";
import { Flex } from "@khenzii-dev/ui/atoms";
import { Paragraph } from "@khenzii-dev/ui/atoms";
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

            <Paragraph>
                {description}
            </Paragraph>
        </Flex>
    );
};
