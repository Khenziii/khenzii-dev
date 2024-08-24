import { Paragraph } from "@khenzii-dev/ui/atoms";
import { ProtectedPage, type ProtectedPageProps } from "@khenzii-dev/ui/organisms";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: ProtectedPage,
    title: 'ProtectedPage',
    tags: ['autodocs'],
};

export const Default: StoriesType<ProtectedPageProps> = {
    args: {
        children: <Paragraph fontSize={1.5}>{"You're authenticated!"}</Paragraph>,
    },
};
