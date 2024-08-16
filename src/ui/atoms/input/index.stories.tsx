import { Input, type InputProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Input,
    title: 'Input',
    tags: ['autodocs'],
};

export const Default: StoriesType<InputProps> = {
    args: {
        rounded: true,
        placeholder: "I'm a placeholder!",
        padding: 10,
        fontSize: 1.5,
    },
};
