import { Logo, Paragraph, Anchor } from "@khenzii-dev/ui/atoms";

const Home = () => (
    <>
        <Logo animate={true} size={300} />

        <Paragraph fontSize={1.5} styles={{ textAlign: "center" }}>
            Hello! This page is being rebuilt. While waiting, visit old version of the site; it can be found <Anchor href={"https://old.khenzii.dev/"} newTab prefetch>here</Anchor>.
        </Paragraph>
    </>
);

export default Home;
