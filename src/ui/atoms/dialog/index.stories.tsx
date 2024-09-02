import { Paragraph, Dialog, type DialogProps } from "@khenzii-dev/ui/atoms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: Dialog,
    title: 'Dialog',
    tags: ['autodocs'],
};

export const Default: StoriesType<DialogProps> = {
    args: {
        title: "Example Dialog",
        open: true,
        onClose: () => console.log("closed!"),
        children: <Paragraph>Example Content</Paragraph>,
    },
};
