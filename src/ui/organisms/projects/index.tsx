"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Flex, Icon, type option, Paragraph, Select } from "@khenzii-dev/ui/atoms";
import { Project } from "./project";
import Image from "next/image";
import {
    KhenziiDevDescription,
    KhenzTiktokbotDescription,
    LolCupDescription,
} from "@khenzii-dev/ui/organisms/projects/descriptions";

export enum projectRole {
    FOUNDER = "Founder",
    CONTRIBUTOR = "Contributor",
}

export type project = {
    name: string;
    description: ReactNode;
    backgroundGradient: string;
    topLeftComponent: ReactNode;
    dates?: [Date, Date?][];
    githubRepoUrl?: string;
    websiteUrl?: string;
    role?: projectRole;
};

export const projects: project[] = [
    {
        name: "khenz-tiktokbot",
        description: <KhenzTiktokbotDescription />,
        backgroundGradient: "linear-gradient(270deg, #FF0050, #00F2EA, #000000)",
        githubRepoUrl: "https://github.com/Khenziii/khenz-tiktokbot",
        dates: [
            [new Date(2023, 4), new Date(2023, 7)],
        ],
        topLeftComponent: <Icon iconName={"robot"} size={2} />,
        role: projectRole.FOUNDER,
    },
    {
        name: "khenzii.dev",
        description: <KhenziiDevDescription />,
        backgroundGradient: "linear-gradient(270deg, #FFFFFF, #20201f)",
        githubRepoUrl: "https://github.com/Khenziii/khenzii-dev",
        websiteUrl: "https://khenzii.dev/",
        dates: [
            [new Date(2023, 7), new Date(2023, 9)],
            [new Date(2024, 1)],
        ],
        topLeftComponent: <Icon iconName={"globe2"} size={2} />,
        role: projectRole.FOUNDER,
    },
    {
        name: "lol-cup",
        description: <LolCupDescription />,
        backgroundGradient: "linear-gradient(270deg, #1AFFAF, #111112)",
        websiteUrl: "https://lolcup.zsl.gda.pl/",
        dates: [
            [new Date(2023, 9), new Date(2024, 1)],
        ],
        topLeftComponent: <Image
            alt={"lol-cup 2024 Logo"}
            src={"/lolcup-2024-logo.svg"}
            width={200}
            height={200}
            style={{ maxWidth: "2rem", maxHeight: "2rem" }}
        />,
        role: projectRole.CONTRIBUTOR,
    },
];

export enum sortByEnum {
    OldestToNewest = "Oldest -> Newest",
    NewestToOldest = "Newest -> Oldest",
    NameAlphabetically = "Name: A -> Z",
}

export const sortByOptions: option[] = [
    {
        text: sortByEnum.NewestToOldest,
        iconName: "clock",
    },
    {
        text: sortByEnum.OldestToNewest,
        iconName: "clock",
    },
    {
        text: sortByEnum.NameAlphabetically,
        iconName: "alphabet",
    },
];

const sortProjectsOldestToNewest = (): project[] => {
    return projects.sort((a, b) => {
        return a.dates![0]![0].getTime() - b.dates![0]![0].getTime();
    });
};

const sortProjectsNewestToOldest = (): project[] => {
    return projects.sort((a, b) => {
        return b.dates![0]![0].getTime() - a.dates![0]![0].getTime();
    });
};

const sortProjectsAlphabetically = (): project[] => {
    return projects.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
};

// export type ProjectsProps = {};

export const Projects = () => {
    const [currentSortOption, setCurrentSortOption] = useState<option>(sortByOptions[0]!);
    const [projectsArray, setProjectsArray] = useState<project[]>(projects);

    useEffect(() => {
        let sorted = undefined;

        switch (currentSortOption.text) {
            case sortByEnum.OldestToNewest as string: {
                sorted = sortProjectsOldestToNewest();
                break;
            }
            case sortByEnum.NewestToOldest as string: {
                sorted = sortProjectsNewestToOldest();
                break;
            }
            case sortByEnum.NameAlphabetically as string: {
                sorted = sortProjectsAlphabetically();
                break;
            }
        }

        if (!sorted) {
            return;
        }

        // This spread is necessary, to ensure that React
        // will notice the state change.
        setProjectsArray([...sorted]);
    }, [currentSortOption]);

    return (
        <Flex direction={"column"} styles={{ marginTop: "10px" }}>
            <Flex direction={"column"} align={"center"}>
                <Paragraph fontSize={1.25}>Sort by:</Paragraph>
                <Select options={sortByOptions} currentOption={currentSortOption} setCurrentOption={setCurrentSortOption} fontSize={1.5} width={"min(20rem, 100vw - 2 * 10px)"} />
            </Flex>

            <div>
                {projectsArray.map((project, index) => (
                    <Project {...project} key={`project-${index}`} />
                ))}
            </div>
        </Flex>
    );
};
