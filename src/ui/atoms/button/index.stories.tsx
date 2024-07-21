import { Button, Paragraph, type ButtonProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Button,
    title: 'Button',
    tags: ['autodocs'],
};

export const Default: StoriesType<ButtonProps> = {
    args: {
        children: <Paragraph>I{"'"}m a button!</Paragraph>,
        padding: 10,
        rounded: true,
        color: "normal",
    },
};

