"use client";

import { useState } from "react";
import { Flex, Logo, Input, Button, Paragraph, Loading } from "@khenzii-dev/ui/atoms";
import { useMobile } from "@khenzii-dev/hooks";
import style from "@khenzii-dev/styles/admin.module.scss";

const Admin = () => {
    const mobile = useMobile();
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [statusParagraphContent, setStatusParagraphContent] = useState("");

    return (
        <Flex 
            styles={{ height: "100vh" }}
            direction="column"
            align="center"
            justify="center"
            gap={50}
        >
            <Logo animate={true} size={mobile ? 275 : 300} />
    
            <Flex
                direction="column"
                justify="center"
                gap={10}
            >
                <Input className={style.input} placeholder="email" type="email" />
                <Input className={style.input} placeholder="password" type="password" />
            </Flex>

            <Button onClick={() => setAwaitingResponse(true)}>
                <Paragraph>Login</Paragraph>
            </Button>

            <Flex
                styles={{ height: mobile ? "100px" : "150px" }}
                justify="center"
            >
                {awaitingResponse ? (
                    <Loading />
                ) : (
                    <Paragraph>
                        {statusParagraphContent}
                    </Paragraph>
                )}
            </Flex>
        </Flex>
    );
};

export default Admin;
