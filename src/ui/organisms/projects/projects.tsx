import Image from "next/image";
import {
    KhenziiDevDescription,
    KhenzTiktokbotDescription,
    LolCupDescription,
} from "@khenzii-dev/ui/organisms/projects/descriptions";
import { Icon } from "@khenzii-dev/ui/atoms";
import { type project } from ".";

export enum projectRole {
    FOUNDER = "Founder",
    CONTRIBUTOR = "Contributor",
}

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
