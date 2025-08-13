import { PrimitiveListItem, type PrimitiveListItemProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: PrimitiveListItem,
    title: 'PrimitiveListItem',
    tags: ['autodocs'],
};

export const Default: StoriesType<PrimitiveListItemProps> = {
    args: {
        level: 0,
        children: "I'm a list item!",
    },
};
