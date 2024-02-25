import { Anchor, type AnchorProps } from "./index";

export type tempType = {
    args: AnchorProps;
}

export default {
    component: Anchor,
    title: 'Anchor',
    tags: ['autodocs'],
};

export const Default: tempType = {
    args: {
        newTab: true,
        children: <p>I{"'"}m a child!</p>,
        href: "https://khenzii.dev/",
        darkenOnHover: true,
        prefetch: true,
    }
};
