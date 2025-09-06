import { Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

const linkProps = {
    prefetch: false,
    darkenOnHover: true,
    newTab: true,
};

export const LolCupDescription = () => <>
    <Paragraph fontSize={1.25}>
        <Anchor href={"https://lolcup.zsl.gda.pl"} {...linkProps}>
            {"ZSŁ LOL CUP"}
        </Anchor>
        {" is a "}
        <Anchor href={"https://en.wikipedia.org/wiki/League_of_Legends"} {...linkProps}>
            {"League of Legends"}
        </Anchor>
        {" tournament organized by the students of "}
         <Anchor href={"https://www.zsl.gda.pl"} {...linkProps}>
            {"ZSŁ Gdańsk"}
        </Anchor>
        {" high school. I've had the chance to help with organizing its VIIth and VIIIth editions. In 2023/2024, I was a contributor helping to manage the old codebase, and the next year I became the lead developer."}
    </Paragraph>
</>;
