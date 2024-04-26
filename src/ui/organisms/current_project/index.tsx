"use client";

// This component is only used on the homepage.
// It was created, to avoid using the "use client"
// directive on src/app/page.tsx.

import { type FC } from "react";
import {
    Anchor,
    Flex,
    Header,
    Loading,
    Paragraph,
} from "@khenzii-dev/ui/atoms";
import { api } from "@khenzii-dev/providers";

// export type currentProjectProps = {};

export const CurrentProject: FC = () => {
    const {
        data: currentProjectData,
        isLoading: currentProjectIsLoading ,
    } = api.current_project.getProject.useQuery();

    return (
        <>
            {(currentProjectIsLoading || currentProjectData === undefined)
                ? (
                    <Loading size={200} />
                )
                : (
                    <Flex direction={"column"} align={"flex-start"}>
                        <Header>Currently working on</Header>

                        <Paragraph fontSize={1.25}>
                            <code>{currentProjectData.name}</code>
                            {" which is "}
                            <code>{currentProjectData.description}</code>
                        </Paragraph>

                        <Paragraph fontSize={1.25}>
                            {"Check out other things that I've made on the "}
                            <Anchor href={"/projects"} prefetch darkenOnHover>projects</Anchor>
                            {" route."}
                        </Paragraph>
                    </Flex>
                )
            }
        </>
    );
};
