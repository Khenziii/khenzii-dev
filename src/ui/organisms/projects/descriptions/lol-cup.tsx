import { Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

const linkProps = {
    prefetch: false,
    darkenOnHover: true,
    newTab: true,
};

export const LolCupDescription = () => <>
    <Paragraph fontSize={1.25}>
        {"If you're from "}
        <Anchor href={"https://en.wikipedia.org/wiki/Danzig"} {...linkProps}>
            Gdańsk
        </Anchor>
        {", then you must've heard about "}
        <Anchor href={"https://lolcup.zsl.gda.pl/"} {...linkProps}>
            ZSŁ LOL CUP
        </Anchor>
        {"."}

        <br />
        <br />

        {"It's a "}
        <Anchor href={"https://www.leagueoflegends.com/"} {...linkProps}>
            League of Legends
        </Anchor>
        {" tournament, that's being organized by students of "}
        <Anchor href={"https://www.zsl.gda.pl/"} {...linkProps}>
            ZSŁ
        </Anchor>
        {". LOL CUP is a yearly event, that has first appeared in 2017."}

        <br />
        <br />

        {"I was lucky, to be able to help with organizing it's 7th edition."}

        <br />
        <br />

        {"Alongside a couple of other devs, we've done a fair amount of rewriting & adding new features to the codebase."}

        <br />
        <br />

        {"Overall, I have learned a lot of cool things, and I for sure recall helping out with the tournament as well-spent time :)"}

        <br />
        <br />

        {"If you want to learn more about the tournament, and you're fluent in Polish, I recommend checking out "}
        <Anchor href={"https://lolcup.zsl.gda.pl/o-turnieju"} {...linkProps}>
            lolcup.zsl.gda.pl/o-turnieju
        </Anchor>
        {"."}
    </Paragraph>
</>;
