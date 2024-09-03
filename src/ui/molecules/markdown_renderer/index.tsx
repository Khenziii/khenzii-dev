import { type FC } from "react";
import Markdown from "react-markdown";
import {
    Paragraph,
    Header,
} from "@khenzii-dev/ui/atoms";

export type MarkdownRendererProps = {
    children: string;
};

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ children }) => (
    <Markdown components={{
        p: ({ children }) => <Paragraph>{children}</Paragraph>,
        h1: ({ children }) => <Header>{children}</Header>,
    }}>
        {children}
    </Markdown>
);
