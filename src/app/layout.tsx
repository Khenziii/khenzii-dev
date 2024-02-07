import { Montserrat } from "next/font/google";
import React from "react";
import style from "../styles/layout.module.scss";
import clsx from "clsx";
import { Footer, Nav } from "@khenzii-dev/ui/ogranisms";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export const metadata = {
  title: "Khenzii :)",
  description: "Khenzii's portfolio.",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body className={clsx(montserrat.className, style.layout)}>
            <nav>
                <Nav />
            </nav>

            {children}

            <footer className={style.footer}>
                <Footer />
            </footer>
        </body>
    </html>
);

export default RootLayout;
