"use client";

import { useState, type KeyboardEventHandler, type FormEventHandler, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
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
        if (!passwordInput.current) return;

        const keys: string[] = ["Enter", "ArrowDown"];
        if (keys.includes(event.key)) {
            // don't submit the form if clicked "Enter"
            event.preventDefault();

            passwordInput.current.focus();
        }
    };

    const handleKeyDownPassword: KeyboardEventHandler = (event) => {
        if (!emailInput.current) return;

        if (event.key == "ArrowUp") emailInput.current.focus();
    };

    // eslint-disable-next-line
    const handleSubmit: FormEventHandler = async (event) => {
        // don't refresh the page
        event.preventDefault();

        if (!emailInput.current || !passwordInput.current) return;

        setAwaitingResponse(true);

        const result = await signIn("credentials", {
            redirect: false,
            email: emailInput.current.value,
            password: passwordInput.current.value,
        });

        setAwaitingResponse(false);

        if (result === undefined) {
            setStatusParagraphContent("An error occurred. Try again later.");
            return;
        }

        if (!result.ok) {
            setStatusParagraphContent("Credentials invalid!");
            return;
        }

        // TODO: redirect to / load the panel here
        setStatusParagraphContent("Success!");
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
   
    
            <form
                className={style.form}
                style={{ gap: "50px" }}
                onSubmit={handleSubmit}
            >
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
                
                <Button
                    onClick={handleSubmit}
                    className={style.login_buton}
                >
                    <Paragraph>Login</Paragraph>
                </Button>
            </form>
            
            <Flex
                styles={{ height: mobile ? "100px" : "150px" }}
                justify="center"
            >
                {awaitingResponse ? (
                    <Loading />
                ) : (
                    <Paragraph fontSize={1.5}>
                        {statusParagraphContent}
                    </Paragraph>
                )}
            </Flex>
        </Flex>
    );
};

export default Admin;
