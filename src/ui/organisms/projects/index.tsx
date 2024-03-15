import { type ReactNode } from "react";
import { Icon } from "@khenzii-dev/ui/atoms";
import { Project } from "./project";
import Image from "next/image";
import {
    KhenziiDevDescription,
    LolCupDescription,
} from "@khenzii-dev/ui/organisms/projects/descriptions";

export type project = {
    name: string;
    description: ReactNode;
    backgroundGradient: string;
    topLeftComponent: ReactNode;
    startedWorking: Date;
    finishedWorking?: Date;
    githubRepoUrl?: string;
    websiteUrl?: string;
};

export const projects: project[] = [
    {
        name: "khenzii.dev",
        description: <KhenziiDevDescription />,
        backgroundGradient: "linear-gradient(270deg, #FFFFFF, #20201f)",
        githubRepoUrl: "https://github.com/Khenziii/khenzii-dev",
        websiteUrl: "https://khenzii.dev/",
        startedWorking: new Date(new Date().getTime() - 1000 * 60 * 60),
        topLeftComponent: <Icon iconName={"globe2"} size={2} />,
    },
    // {
    //     name: "khenz-tiktokbot",
    //     description: <Paragraph>
    //         ... This should be filled out later..
    //     </Paragraph>,
    //     backgroundGradient: "linear-gradient(270deg, #FF0050, #00F2EA)",
    //     githubRepoUrl: "https://github.com/Khenziii/khenz-tiktokbot",
    //     startedWorking: new Date(new Date().getTime() - 1000 * 60 * 60),
    //     topLeftComponent: <Icon iconName={"robot"} size={2} />,
    // },
    {
        name: "lol-cup",
        description: <LolCupDescription />,
        backgroundGradient: "linear-gradient(270deg, #1AFFAF, #111112)",
        websiteUrl: "https://lolcup.zsl.gda.pl/",
        startedWorking: new Date(new Date().getTime() - 1000 * 60 * 60),
        topLeftComponent: <Image
            alt={"lol-cup 2024 Logo"}
            src={"/lolcup-2024-logo.svg"}
            width={200}
            height={200}
            style={{ maxWidth: "2rem", maxHeight: "2rem" }}
        />,
    },
];

// export type ProjectsProps = {};

export const Projects = () => (
    <>
        {projects.map((project, index) => (
            <Project {...project} key={`project-${index}`} />
        ))}
    </>
);
