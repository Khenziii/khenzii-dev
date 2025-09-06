import Image from "next/image";
import {
    KhenziiDevDescription,
    KhenzTiktokbotDescription,
    LolCupDescription,
    CroissantdealerDescription,
    GuessTheNumberAsmDescription,
    KorwinPortableDescription,
    MntaDescription,
    NixosConfigDescription,
    SnakeAiDescription,
    SpacePicsDescription,
} from "@khenzii-dev/ui/organisms/projects/descriptions";
import { Icon } from "@khenzii-dev/ui/atoms";
import { type project } from ".";

export enum projectRole {
    FOUNDER = "Founder",
    CONTRIBUTOR = "Contributor",
    MAINTAINER = "Maintainer",
}

export const projects: project[] = [
    {
        name: "khenz-tiktokbot",
        description: <KhenzTiktokbotDescription />,
        backgroundGradient: "linear-gradient(270deg, #FF0050, #00F2EA, #000000)",
        githubRepoUrl: "https://github.com/khenziii/khenz-tiktokbot",
        dates: [
            [new Date(2023, 4), new Date(2023, 7)],
        ],
        topLeftComponent: <Icon iconName={"robot"} size={2} />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "khenzii.dev",
        description: <KhenziiDevDescription />,
        backgroundGradient: "linear-gradient(270deg, #FFFFFF, #20201f)",
        githubRepoUrl: "https://github.com/khenziii/khenzii-dev",
        websiteUrl: "https://khenzii.dev/",
        dates: [
            [new Date(2023, 7), new Date(2023, 9)],
            [new Date(2024, 1), new Date(2024, 4)],
            [new Date(2024, 7), new Date(2024, 8)],
        ],
        topLeftComponent: <Icon iconName={"globe2"} size={2} />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "lol-cup",
        description: <LolCupDescription />,
        backgroundGradient: "linear-gradient(270deg, #1AFFAF, #111112)",
        websiteUrl: "https://lolcup.zsl.gda.pl/",
        dates: [
            [new Date(2023, 8), new Date(2024, 1)],
            [new Date(2024, 8), new Date(2025, 4)],
        ],
        topLeftComponent: <Image
            alt={"lol-cup 2024 Logo"}
            src={"/projects/lolcup-2024-logo.svg"}
            width={200}
            height={200}
            style={{ maxWidth: "2rem", maxHeight: "2rem" }}
        />,
        roles: [projectRole.CONTRIBUTOR, projectRole.MAINTAINER],
    },
    {
        name: "snake-ai",
        description: <SnakeAiDescription />,
        backgroundGradient: "linear-gradient(270deg, #FFFFFF, #CCCCCC, #FF0000)",
        githubRepoUrl: "https://github.com/Khenziii/snake-ai",
        dates: [
            [new Date(2024, 2, 17), new Date(2024, 2, 31)],
        ],
        topLeftComponent: <Image
            alt={"snake AI logo"}
            src={"/projects/snake-ai-logo.svg"}
            width={200}
            height={200}
            style={{ maxWidth: "2rem", maxHeight: "2rem" }}
        />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "korwin-portable",
        description: <KorwinPortableDescription />,
        backgroundGradient: "linear-gradient(270deg, #A97BFF)",
        githubRepoUrl: "https://github.com/khenziii/korwin-portable",
        dates: [
            [new Date(2024, 8, 20), new Date(2024, 8, 26)],
        ],
        topLeftComponent: <Image
            alt={"three arrows"}
            src={"/projects/three-arrows.svg"}
            width={200}
            height={200}
            style={{ maxWidth: "2rem", maxHeight: "2rem" }}
        />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "space-pics",
        description: <SpacePicsDescription />,
        backgroundGradient: "linear-gradient(270deg, #3572A5)",
        githubRepoUrl: "https://github.com/khenziii/space-pics",
        dates: [
            [new Date(2024, 2, 24), new Date(2024, 3, 14)],
        ],
        topLeftComponent: <Icon iconName={"stars"} size={2} />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "guess-the-number-asm",
        description: <GuessTheNumberAsmDescription />,
        backgroundGradient: "linear-gradient(270deg, #6E4C13)",
        githubRepoUrl: "https://github.com/khenziii/guess-the-number-asm",
        dates: [
            [new Date(2024, 6, 30), new Date(2024, 7, 6)],
        ],
        topLeftComponent: <Icon iconName={"gear-fill"} size={2} />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "mnta",
        description: <MntaDescription />,
        backgroundGradient: "linear-gradient(270deg, #555555)",
        githubRepoUrl: "https://github.com/khenziii/mnta",
        dates: [
            [new Date(2025, 4), new Date(2025, 6)],
        ],
        topLeftComponent: <Icon iconName={"sticky-fill"} size={2} />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "croissantdealer",
        description: <CroissantdealerDescription />,
        backgroundGradient: "linear-gradient(270deg, #FFFFFF)",
        githubRepoUrl: "https://github.com/khenziii/croissantdealer",
        dates: [
            [new Date(2023, 9, 15), new Date(2023, 9, 31)],
        ],
        topLeftComponent: <Icon iconName={"cpu-fill"} size={2} />,
        roles: [projectRole.FOUNDER],
    },
    {
        name: "nixos-config",
        description: <NixosConfigDescription />,
        backgroundGradient: "linear-gradient(270deg, #5073bd, #7eb7e2)",
        githubRepoUrl: "https://github.com/khenziii/nixos-config",
        dates: [
            [new Date(2024, 2)],
        ],
        topLeftComponent: <Icon iconName={"snow"} size={2} />,
        roles: [projectRole.FOUNDER],
    },
];
