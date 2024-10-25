import { type FC } from "react";
import Markdown from "react-markdown";
import {
    Paragraph,
    Header,
} from "@khenzii-dev/ui/atoms";

export type MarkdownRendererProps = {
    children: string;
    sizeMultiplier?: number;
};

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ children, sizeMultiplier = 1 }) => (
    <Markdown components={{
        p: ({ children }) => <Paragraph fontSize={1.5 * sizeMultiplier}>{children}</Paragraph>,
        h1: ({ children }) => <Header fontSize={2 * sizeMultiplier}>{children}</Header>,
    }}>
        {children}
    </Markdown>
);
