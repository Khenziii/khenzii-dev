"use client";

// This component is only used on the homepage.
// It was created, to avoid using the "use client"
// directive on src/app/page.tsx.

import { type FC } from "react";
import {
    Loading,
    Paragraph,
    CodeBlock,
} from "@khenzii-dev/ui/atoms";
import { api } from "@khenzii-dev/providers";

export type CurrentProjectProps = {
    fontSize?: number;
    loadingSize?: number;
};

export const CurrentProject: FC<CurrentProjectProps> = ({ fontSize = 1.25, loadingSize = 100 }) => {
    const {
        data: currentProjectData,
        isLoading: currentProjectIsLoading ,
    } = api.current_project.getProject.useQuery();

    return (
        <>
            {(currentProjectIsLoading || currentProjectData === undefined)
                ? (
                    <Loading size={loadingSize} />
                )
                : (
                    <Paragraph fontSize={fontSize}>
                        <CodeBlock>{currentProjectData.name}</CodeBlock>
                        {" which is "}
                        <CodeBlock>{currentProjectData.description}</CodeBlock>
                    </Paragraph>
                )
            }
        </>
    );
};
