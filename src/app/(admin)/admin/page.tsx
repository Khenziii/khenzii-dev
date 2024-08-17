"use client";

import { useState, type KeyboardEventHandler, useRef, useEffect } from "react";
import { Flex, Logo, Input, Button, Paragraph, Loading } from "@khenzii-dev/ui/atoms";
import { useMobile } from "@khenzii-dev/hooks";
import style from "@khenzii-dev/styles/admin.module.scss";

const Admin = () => {
    const mobile = useMobile();
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [statusParagraphContent, setStatusParagraphContent] = useState("");


    const handleKeyDownEmail: KeyboardEventHandler = (event) => {
        const keys: string[] = ["Enter", "ArrowDown"];
        if (keys.includes(event.key)) {
            if (!passwordInput.current) return;
            passwordInput.current.focus();
        };
    };

    const handleKeyDownPassword: KeyboardEventHandler = (event) => {
        if (event.key == "ArrowUp") {
            if (!emailInput.current) return;
            emailInput.current.focus();
        }
        
        if (event.key == "Enter") {
            // TODO send the request here later
            setAwaitingResponse(true);        
        }
    };

    useEffect(() => {
        if (!emailInput.current) return;
        emailInput.current.focus();
    }, []);


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
                <Input
                    className={style.input}
                    placeholder="email"
                    type="email"
                    onKeyDown={handleKeyDownEmail}
                    ref={emailInput}
                    borderGreenIfValid
                    borderRedIfInvalid
                />
                <Input
                    className={style.input}
                    placeholder="password"
                    type="password"
                    onKeyDown={handleKeyDownPassword}
                    ref={passwordInput}
                />
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
