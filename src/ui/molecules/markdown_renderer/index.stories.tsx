import { MarkdownRenderer, type MarkdownRendererProps } from "@khenzii-dev/ui/molecules";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: MarkdownRenderer,
    title: 'MarkdownRenderer',
    tags: ['autodocs'],
};

export const Default: StoriesType<MarkdownRendererProps> = {
    args: {
        children: "# I'm a header \n I'm a paragraph",
    },
};
