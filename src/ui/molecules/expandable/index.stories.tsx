import { Expandable, type ExpandableProps } from "@khenzii-dev/ui/molecules";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";
import { Paragraph } from "@khenzii-dev/ui/atoms";

export default {
    component: Expandable,
    title: 'Expandable',
    tags: ['autodocs'],
};

export const Default: StoriesType<ExpandableProps> = {
    args: {
        isExpanded: true,
        startWidth: "0",
        startHeight: "0",
        endWidth: "auto",
        endHeight: "auto",
        exitDirection: "top-left",
        children: <Paragraph>:3</Paragraph>,
    },
};
