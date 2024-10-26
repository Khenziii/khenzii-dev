import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode, FC } from "react";
import { Providers } from "@khenzii-dev/providers";
import style from "@khenzii-dev/styles/layout.module.scss";
import clsx from "clsx";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
    display: "swap",
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
    <Providers>
        <html lang="en">
            <body className={clsx(style.layout, montserrat.className)}>
                {children}
            </body>
        </html>
    </Providers>
);

export default RootLayout;
