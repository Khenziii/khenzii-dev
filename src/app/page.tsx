"use client";

import {
    Logo,
    Paragraph,
    Flex,
    CurrentTime,
    Header,
    Anchor,
    Loading,
    CodeBlock,
} from "@khenzii-dev/ui/atoms";
import style from "@khenzii-dev/styles/home.module.scss";
import { useMobile } from "@khenzii-dev/hooks";
import { api } from "@khenzii-dev/providers";

const Home = () => {
    const {
        data: currentProjectData,
        isLoading: currentProjectIsLoading ,
    } = api.current_project.getProject.useQuery();
    const mobile = useMobile();


    return (
        <Flex direction={"column"} gap={20} className={style.container}>
            <Flex direction={"column"} align={"center"} gap={0}>
                <Logo animate={true} size={mobile ? 275 : 300} />

                <Paragraph fontSize={mobile ? 2 : 2.25} className={style.name}>
                    Khenzii
                </Paragraph>

                <Paragraph fontSize={mobile ? 1.5 : 1.75} className={style.title}>
                    Hobbyist Programmer
                </Paragraph>
            </Flex>

            <Paragraph fontSize={mobile ? 1.35 : 1.5}>
                {"Hello! ^^. I'm Khenzii, and I create stuff."}
            </Paragraph>

            <Flex direction={"column"} align={"flex-start"} gap={0}>
                <Header fontsize={mobile ? 1.75 : 2}>About Me</Header>

                <ul className={style.aboutList}>
                    <li>
                        <Paragraph fontSize={1.25}>Open-Source enjoyer.</Paragraph>
                    </li>
                    <li>
                        <Paragraph fontSize={1.25}>
                            {"Based in Poland, Gdańsk; where it's currently "}
                            <CurrentTime accuracy={"seconds"} />
                            {"."}
                        </Paragraph>
                    </li>
                    <li>
                        <Paragraph fontSize={1.25}>
                            High School student.
                        </Paragraph>
                    </li>
                </ul>
            </Flex>

            <Flex direction={"column"} align={"flex-start"}>
                <Header fontsize={mobile ? 1.75 : 2}>Current Project</Header>

                {(currentProjectIsLoading || currentProjectData === undefined)
                    ? (
                        <Loading size={100} />
                    )
                    : (
                        <Paragraph fontSize={1.25}>
                            {"I'm currently working on "}
                            <CodeBlock>{currentProjectData.name}</CodeBlock>
                            {" which is "}
                            <CodeBlock>{currentProjectData.description}</CodeBlock>
                        </Paragraph>
                    )
                }

                <Paragraph fontSize={1.25}>
                    {"Check out other things that I've made on the "}
                    <Anchor href={"/projects"} prefetch darkenOnHover>projects</Anchor>
                    {" route."}
                </Paragraph>
            </Flex>
        </Flex>
    );
};

export default Home;
