import { MarkdownRenderer, type MarkdownRendererProps } from "@khenzii-dev/ui/organisms";
import type { StoriesType } from "@khenzii-dev/ui/types";

const MARKDOWN = `
# I'm a first-level header

## I'm a second level header

### I'm a third level header

I'm a paragraph!

[I'm an anchor!](https://old.khenzii.dev/freebobux)

![I'm an image! What you're reading is the alt text](https://files.khenzii.dev/eu-boykisser.png)

<video src="https://files.khenzii.dev/eu-commission-rising-an-lgbtqia-flag.mp4" type="video/mp4" controls>
    I'm a video! What you're reading is the alt text
</video>
`;


export default {
    component: MarkdownRenderer,
    title: 'MarkdownRenderer',
    tags: ['autodocs'],
};

export const Default: StoriesType<MarkdownRendererProps> = {
    args: {
        children: MARKDOWN,
    },
};
