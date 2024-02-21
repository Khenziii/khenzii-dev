import { Logo, Paragraph } from "@khenzii-dev/ui/atoms";

const Home = () => (
    <>
        <Logo animate={true} size={300} />

        <Paragraph fontSize={1.5} styles={{ textAlign: "center" }}>
            Hello! This page is being rebuilt. While waiting, visit old version of the site; it can be found <a href={"https://old.khenzii.dev/"}>here</a>.
        </Paragraph>
    </>
);

export default Home;
