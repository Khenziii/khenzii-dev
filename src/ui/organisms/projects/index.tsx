"use client";

import { type ReactNode, useEffect, useState, useCallback } from "react";
import { Flex, type option, Paragraph, Select, SelectContext } from "@khenzii-dev/ui/atoms";
import { Project } from "./project";
import { type projectRole, projects as definedProjectsArray } from "./projects";

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
] as const;

const sortProjectsOldestToNewest = (projects: project[]): project[] => {
    return projects.sort((a, b) => {
        return a.dates![0]![0].getTime() - b.dates![0]![0].getTime();
    });
};

const sortProjectsNewestToOldest = (projects: project[]): project[] => {
    return projects.sort((a, b) => {
        return b.dates![0]![0].getTime() - a.dates![0]![0].getTime();
    });
};

const sortProjectsAlphabetically = (projects: project[]): project[] => {
    return projects.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
};

const sortProjects = (projects: project[], sortOption: option): project[] => {
    let sorted: project[] = [];

    switch (sortOption.text) {
        case sortByEnum.OldestToNewest as string: {
            sorted = sortProjectsOldestToNewest(projects);
            break;
        }
        case sortByEnum.NewestToOldest as string: {
            sorted = sortProjectsNewestToOldest(projects);
            break;
        }
        case sortByEnum.NameAlphabetically as string: {
            sorted = sortProjectsAlphabetically(projects);
            break;
        }
    }

    return sorted;
};

const projects = sortProjects(definedProjectsArray, sortByOptions[0]!);

// export type ProjectsProps = {};

export const Projects = () => {
    const [currentSortOption, setCurrentSortOption] = useState<option>(sortByOptions[0]!);
    const [projectsArray, setProjectsArray] = useState<project[]>(projects);
    const [hasChangedSortingOrder, setHasChangedSortingOrder] = useState(false);
    const [canProjectsBeExpanded, setCanProjectsBeExpanded] = useState(true);

    const sort = useCallback(
        (currentSortOption: option): { waitTimeout: number; sortedProjects: project[] } => {
            const collapseTimeMs = 1500;

            if (hasChangedSortingOrder) {
                setCanProjectsBeExpanded(false);
    
                setTimeout(() => {
                    setCanProjectsBeExpanded(true);
                }, collapseTimeMs);
            }
    
            const sorted = sortProjects(projects, currentSortOption);
            return {
                waitTimeout: hasChangedSortingOrder ? collapseTimeMs : 0,
                sortedProjects: sorted,
            };
        },
        [hasChangedSortingOrder]
    );

    useEffect(() => {
        const { waitTimeout, sortedProjects } = sort(currentSortOption);
        const timeout = setTimeout(() => {
            setProjectsArray([...sortedProjects]);
        }, waitTimeout);

        return () => clearTimeout(timeout);
    }, [currentSortOption, sort]);

    return (
        <>
            <Flex direction={"column"} align={"center"}>
                <Paragraph fontSize={1.25}>Sort by:</Paragraph>

                <SelectContext.Provider value={{ currentOption: currentSortOption, setCurrentOption: setCurrentSortOption }}>
                    <Select
                        options={sortByOptions}
                        fontSize={1.5}
                        width={"min(20rem, 100vw - 2 * 10px)"}
                        onSelect={() => setHasChangedSortingOrder(true)}
                    />
                </SelectContext.Provider>
            </Flex>

            <div>
                {projectsArray.map((project) => (
                    <Project canBeExpanded={canProjectsBeExpanded} {...project} key={`project-${project.name}`} />
                ))}
            </div>
        </>
    );
};
