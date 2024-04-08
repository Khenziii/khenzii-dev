import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode, FC } from "react";
import { Footer, Nav } from "src/ui/organisms";
import { ReactQueryProvider } from "@khenzii-dev/providers";
import style from "../styles/layout.module.scss";
import clsx from "clsx";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Khenzii",
        template: "%s | Khenzii",
    },
    description: "Khenzii's portfolio.",
    icons: [{ rel: "icon", url: "/logo.svg" }],
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <ReactQueryProvider>
        <html lang="en">
            <body className={clsx(style.layout, montserrat.className)}>
                <nav className={style.nav}>
                    <Nav/>
                </nav>

                <main className={style.content}>
                    {children}
                </main>

                <footer className={style.footer}>
                    <Footer/>
                </footer>
            </body>
        </html>
    </ReactQueryProvider>
);

export default RootLayout;
