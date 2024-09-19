import { Tags, type TagsProps } from "@khenzii-dev/ui/organisms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Tags,
    title: 'Tags',
    tags: ['autodocs'],
};

export const Default: StoriesType<TagsProps> = {
    args: {
        tags: [
            {
                active: true,
                name: "active tag",
            },
            {
                active: false,
                name: "inactive tag",
            },
            {
                active: false,
                name: "another tag",
            },
        ],
        onClick: (tags) => {
            console.log("tags:");
            tags.forEach((tag) => console.log(tag));
        },
    },
};
