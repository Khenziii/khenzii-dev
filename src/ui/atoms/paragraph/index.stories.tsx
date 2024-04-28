import { Paragraph, type ParagraphProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Paragraph,
    title: 'Paragraph',
    tags: ['autodocs'],
};

export const Default: StoriesType<ParagraphProps> = {
    args: {
        fontSize: 2,
        children: "I'm the child!",
    },
};
