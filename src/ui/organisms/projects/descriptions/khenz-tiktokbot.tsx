import { Paragraph, CodeBlock } from "@khenzii-dev/ui/atoms";
import { Multimedia } from "@khenzii-dev/ui/molecules";

export const KhenzTiktokbotDescription = () => <>
    <Paragraph fontSize={1.25}>
        {"Have you ever seen a video like this one?:"}
    </Paragraph>

    <Multimedia additionalText={"tiktok.com/@reddits.stories/video/7058285591917645061"}>
        <video controls>
            <source src={"/videos/tiktok-reddit-story.mp4"} />
            {"a Reddit story short video"}
        </video>
    </Multimedia>

    <Paragraph fontSize={1.25}>
        {"They've been pretty popular around 2023. Upon seeing them, I've noticed that technically it's easy to mass generate content like this, and so I've created "}
        <CodeBlock>{"khenz-tiktokbot"}</CodeBlock>
        {". I didn't use it too much, as that would bloat social media with auto-generated slop even more, and there are legitimate creators in such spaces that actually deserve viewership, but rather used it as a learning experience. I've experimented with Reddit's API, FFmpeg and web scraping."}
    </Paragraph>
</>;
