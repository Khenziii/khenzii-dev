import { Select, type SelectProps } from "@khenzii-dev/ui/atoms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: Select,
    title: 'Select',
    tags: ['autodocs'],
};

export const Default: StoriesType<SelectProps> = {
    args: {
        options: [
            {
                text: "First option",
                iconName: "clock",
            },
            {
                text: "Second option",
                iconName: "alphabet",
            },
            {
                text: "Third option",
                iconName: "key",
            },
        ],
        fontSize: 2,
        openedByDefault: false,
        animationDuration: 0.5,
    },
};
