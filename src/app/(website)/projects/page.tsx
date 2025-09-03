import type { Metadata } from "next";
import { Projects as ProjectsComponent } from "@khenzii-dev/ui/organisms";
import { type IconsArrayProps, IconsArray } from "@khenzii-dev/ui/molecules";
import { Flex, Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

const proficientTechnologies: IconsArrayProps["icons"] = [];
const otherTechnologies: IconsArrayProps["icons"] = [];

export const metadata: Metadata = {
    title: "Projects",
};

const Projects = () => (
    <Flex direction={"column"} styles={{ marginTop: "10px" }}>
        <Paragraph fontSize={1.25} styles={{ textAlign: "center" }}>
            {"Across the years, I've worked with many technologies. Here are the ones I'm the most proficient in:"}
        </Paragraph>

        <IconsArray icons={proficientTechnologies} />

        <Paragraph fontSize={1.25} styles={{ textAlign: "center" }}>
            {"And here are the ones with which I've had direct contact at some point:"}
        </Paragraph>

        <IconsArray icons={otherTechnologies} />

        <Paragraph fontSize={1.25} styles={{ textAlign: "center" }}>
            {"Below are some of my projects. If you want to see the rest of my public ones, feel free to visit my "}
            <Anchor href={"https://github.com/khenziii"} darkenOnHover>{"GitHub"}</Anchor>
            {" profile."}
        </Paragraph>

        <ProjectsComponent />
    </Flex>
);

export default Projects;
