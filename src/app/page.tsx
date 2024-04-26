import {
    Logo,
    Paragraph,
    Flex,
    CurrentTime,
} from "@khenzii-dev/ui/atoms";
import { CurrentProject } from "@khenzii-dev/ui/organisms";
import style from "@khenzii-dev/styles/home.module.scss";

const Home = () => (
    <Flex direction={"column"} gap={20}>
        <Flex direction={"column"} align={"center"} gap={0}>
            <Logo animate={true} size={300} />

            <Paragraph fontSize={2.25}>
                Khenzii
            </Paragraph>

            <Paragraph fontSize={1.75} className={style.title}>
                Hobbyist Programmer
            </Paragraph>
        </Flex>

        <Paragraph fontSize={1.5}>
            {"Hello! ^^. I'm Khenzii, and I create stuff."}
        </Paragraph>

        <Flex direction={"column"} align={"flex-start"} gap={0}>
            {/*TODO: implement a `Header` component*/}
            <Paragraph fontSize={1.5}>
                About Me
            </Paragraph>

            <ul className={style.aboutList}>
                <li>
                    <Paragraph fontSize={1.25}>Open-Source enjoyer.</Paragraph>
                </li>
                <li>
                    {/*TODO: implement calculating current Europe/Warsaw time, and create a `code` component*/}
                    <Paragraph fontSize={1.25}>
                        {"Based in Poland, Gdańsk; where it's currently "}
                        <CurrentTime />
                        {"."}
                    </Paragraph>
                </li>
                <li>
                    <Paragraph fontSize={1.25}>
                        High School student.
                    </Paragraph>
                </li>
            </ul>
        </Flex>

        <CurrentProject />
    </Flex>
);

export default Home;
