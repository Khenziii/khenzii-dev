import { Logo, Paragraph, Flex } from "@khenzii-dev/ui/atoms";
import style from "@khenzii-dev/styles/home.module.scss";

const Home = () => (
    <Flex direction={"column"} gap={20}>
        <Flex direction={"column"} align={"center"} gap={0}>
            <Logo animate={true} size={300} />

            <Paragraph fontSize={2}>
                Khenzii
            </Paragraph>

            <Paragraph fontSize={1.5} className={style.title}>
                Hobbyist Programmer
            </Paragraph>
        </Flex>
    </Flex>
);

export default Home;
