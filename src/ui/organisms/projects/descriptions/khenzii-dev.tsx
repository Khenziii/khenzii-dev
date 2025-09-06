import { Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

const linkProps = {
    prefetch: false,
    darkenOnHover: true,
    newTab: true,
};

export const KhenziiDevDescription = () => <>
    <Paragraph fontSize={1.25}>
        {"This project is the website that you're browsing right now! If you want to visit the old version, checkout "}
        <Anchor href={"https://old.khenzii.dev"} {...linkProps}>{"old.khenzii.dev"}</Anchor>
        {"."}
    </Paragraph>
</>;
