import { Expandable, type ExpandableProps } from "@khenzii-dev/ui/molecules";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";
import { Paragraph } from "@khenzii-dev/ui/atoms";

export default {
    component: Expandable,
    title: 'Expandable',
    tags: ['autodocs'],
};

export const Default: StoriesType<ExpandableProps> = {
    args: {
        animationDuration: 0.5,
        startWidth: "fit-content",
        startHeight: "auto",
        endWidth: "200px",
        endHeight: "250px",
        closeElement: <Paragraph styles={{ textAlign: "center", height: "50px" }}>I{"'"}m the close element! (click me to close)</Paragraph>,
        children: <img src={"https://placekitten.com/200/200"} alt={"200x200 image of a kitten <3"}/>,
        openElement: <Paragraph styles={{ maxWidth: "200px" }}>I{"'"}m the open element! (click me to open)</Paragraph>,
        keepOpenElementVisible: true,
        wrapOutOfFlow: true,
    },
};
