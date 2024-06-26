import { Tooltip, type TooltipProps, Paragraph, Icon } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Tooltip,
    title: 'Tooltip',
    tags: ['autodocs'],
};

export const Default: StoriesType<TooltipProps> = {
    args: {
        children: <Icon iconName={"heart"} />,
        tooltip: <Paragraph>I{"'"}m a paragraph!</Paragraph>,
    },
};
