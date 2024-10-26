"use client";

import { useContext, useEffect } from "react";
import { IsNotFoundContext } from "@khenzii-dev/providers";
import { Footer, Nav } from "@khenzii-dev/ui/organisms";
import { Paragraph } from "@khenzii-dev/ui/atoms";
import style from "@khenzii-dev/styles/layout_website.module.scss";

const NotFound = () => {
    const { setIsNotFound }  = useContext(IsNotFoundContext);

    useEffect(() => {
        setIsNotFound(true);

        return () => setIsNotFound(false);
    }, [setIsNotFound]);

    return (
        <>
            <nav className={style.nav}>
                <Nav/>
            </nav>
    
            <main className={style.content}>
                <Paragraph fontSize={1.5} styles={{ textAlign: "center" }}>
                    {"This route doesn't exist."}
                </Paragraph>
            </main>
    
            <footer className={style.footer}>
                <Footer/>
            </footer>
        </>
    );
};

export default NotFound;

