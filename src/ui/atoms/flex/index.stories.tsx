import { Flex, type FlexProps, Paragraph } from "@khenzii-dev/ui/atoms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: Flex,
    title: 'Flex',
    tags: ['autodocs'],
};

const child = <>
    <div>
        <Paragraph>Flex</Paragraph>
    </div>

    <div>
        <Paragraph>Flex</Paragraph>
    </div>
</>

export const Default: StoriesType<FlexProps> = {
    args: {
        gap: 10,
        align: "center",
        justify: "center",
        direction: "column",
        fullWidth: true,
        children: child,
    }
};
