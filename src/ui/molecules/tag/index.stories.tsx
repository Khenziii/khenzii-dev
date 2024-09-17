import { Tag, type TagProps } from "@khenzii-dev/ui/molecules";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Tag,
    title: 'Tag',
    tags: ['autodocs'],
};

export const Default: StoriesType<TagProps> = {
    args: {
        name: "Example Tag",
        onClick: () => console.log("clicked!"),
        active: false,
        size: 2,
    },
};
