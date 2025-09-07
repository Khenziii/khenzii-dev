import { Paragraph, CodeBlock } from "@khenzii-dev/ui/atoms";

export const NixosConfigDescription = () => <>
    <Paragraph fontSize={1.25}>
        {"As a programmer, I'll probably spend many thousands of hours more behind my desk. Due to this, I wanted to keep track of my current working environment as accurately as possible to maximize my productivity. This is exactly what "}
        <CodeBlock>{"nixos-config"}</CodeBlock>
        {" does. Thanks to it, I can ensure that all of the apps I  need are installed, things look how I want them too, and much more."}
    </Paragraph>
</>;
