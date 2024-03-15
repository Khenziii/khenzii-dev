import { Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

const linkProps = {
    prefetch: false,
    darkenOnHover: true,
    newTab: true,
};

export const KhenziiDevDescription = () => <>
    <Paragraph fontSize={1.25}>
        {"I know, I know; it might seem a little bit sketchy to add the portfolio to it's very own projects list, but hear me out:"}

        <br />
        <br />

        {"This website has some pretty deep history behind it ;>."}
        <br />
        {"The version of the site that you're currently using, is actually a rewrite of an old one!"}
        <br />
        {"khenzii.dev was originally created in summer of 2023. It consisted mainly of vanilla JS (literally didn't even use "}
        <Anchor href={"https://jquery.com/"} {...linkProps}>
            JQuery
        </Anchor>
        {" xD) and was hosted on a single VPS."}

        <br />
        <br />

        {"The thing that surprises me the most when looking back to that project, is that I have actually began to reinvent the wheel. In the "}
        <Anchor href={"https://github.com/Khenziii/khenzii-dev/tree/b24f29d0840abb41b1b7f321c4e161863e7685df"} {...linkProps}>
            source code
        </Anchor>
        {", you can notice, that I've tried to replicate server-side rendering using string formatting, lol."}

        <br />
        <br />

        {"If you want to, you can checkout the previous version of this website on "}
        <Anchor href={"https://old.khenzii.dev/"} {...linkProps}>
            old.khenzii.dev
        </Anchor>
        {"."}
    </Paragraph>
</>;
