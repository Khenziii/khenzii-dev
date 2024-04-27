import {
    Logo,
    Paragraph,
    Flex,
    CurrentTime,
    Header,
    Anchor,
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
            <Header>About Me</Header>

            <ul className={style.aboutList}>
                <li>
                    <Paragraph fontSize={1.25}>Open-Source enjoyer.</Paragraph>
                </li>
                <li>
                    <Paragraph fontSize={1.25}>
                        {"Based in Poland, Gdańsk; where it's currently "}
                        <CurrentTime accuracy={"seconds"} />
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

        <Flex direction={"column"} align={"flex-start"}>
            <Header>Currently Working on</Header>

            <Flex justify={"center"} styles={{ width: "100%" }}>
                <CurrentProject />
            </Flex>

            <Paragraph fontSize={1.25}>
                {"Check out other things that I've made on the "}
                <Anchor href={"/projects"} prefetch darkenOnHover>projects</Anchor>
                {" route."}
            </Paragraph>
        </Flex>
    </Flex>
);

export default Home;
