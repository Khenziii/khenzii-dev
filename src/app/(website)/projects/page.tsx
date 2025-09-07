import type { Metadata } from "next";
import { Projects as ProjectsComponent, Technologies } from "@khenzii-dev/ui/organisms";
import { Flex } from "@khenzii-dev/ui/atoms";
import style from "@khenzii-dev/styles/projects.module.scss";

export const metadata: Metadata = {
    title: "Projects",
};

const Projects = () => (
    <Flex direction={"column"} styles={{ marginTop: "10px" }} className={style.container}>
        <Technologies />

        <ProjectsComponent />
    </Flex>
);

export default Projects;
