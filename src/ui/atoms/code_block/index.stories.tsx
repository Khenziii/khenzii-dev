import { CodeBlock, type CodeBlockProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: CodeBlock,
    title: 'CodeBlock',
    tags: ['autodocs'],
};

export const Default: StoriesType<CodeBlockProps> = {
    args: {
        children: "Hello, World!",
    },
};
