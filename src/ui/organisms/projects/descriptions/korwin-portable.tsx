import { Paragraph, Anchor, CodeBlock } from "@khenzii-dev/ui/atoms";

export const KorwinPortableDescription = () => <>
    <Paragraph fontSize={1.25}>
        <Anchor href={"https://pl.wikipedia.org/wiki/Janusz_Korwin-Mikke"} darkenOnHover newTab>{"Janusz Korwin-Mikke"}</Anchor>
        {" is a Polish far right politican that deserves to be made fun of. "}
        <CodeBlock>{"korwin-portable"}</CodeBlock>
        {" generates satirical sentences that he could mumble."}
    </Paragraph>
</>;
