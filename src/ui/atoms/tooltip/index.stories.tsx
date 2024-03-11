import { Tooltip, type TooltipProps, Paragraph, Icon } from "@khenzii-dev/ui/atoms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: Tooltip,
    title: 'Tooltip',
    tags: ['autodocs'],
};

export const Default: StoriesType<TooltipProps> = {
    args: {
        originalContent: <Icon iconName={"heart"} />,
        tooltip: <Paragraph>I{"'"}m a paragraph!</Paragraph>,
    },
};
