import type { ReactNode, FC } from "react";
import { Footer, Nav } from "@khenzii-dev/ui/organisms";
import style from "@khenzii-dev/styles/layout_website.module.scss";

const WebsiteLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <>
        <nav className={style.nav}>
            <Nav/>
        </nav>

        <main className={style.content}>
            {children}
        </main>

        <footer className={style.footer}>
            <Footer/>
        </footer>
    </>
);

export default WebsiteLayout;
