"use client";

import { useSession, signOut } from "next-auth/react";
import {
    Paragraph,
    Button,
    Icon,
    Flex,
    Header,
    CodeBlock,
} from "@khenzii-dev/ui/atoms";
import style from "@khenzii-dev/styles/admin.module.scss";

const Admin = () => {
    const { data: session } = useSession();
    if (!session) return;


    return (
        <Flex
            direction="column"
            align="center"
        >
            <Header>Welcome, {session.user.name}!</Header>

            <Flex direction="column" align="center">
                <Paragraph fontSize={1.75}>Session Details:</Paragraph>
                <Paragraph fontSize={1.5}>
                    <CodeBlock>
                    Username: {session.user.name} <br />
                    Email: {session.user.email} <br />
                    </CodeBlock>
                </Paragraph>
            </Flex>

            <Button
                onClick={() => signOut({ redirect: false })}
                className={style.logout_button}
            >
                <Flex direction="row" align="center">
                    <Paragraph fontSize={1.5}>Logout</Paragraph>
                    <Icon iconName={"box-arrow-right"} size={1.5} />
                </Flex>
            </Button>
        </Flex>
    );
};

export default Admin;
