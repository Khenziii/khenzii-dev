import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode, FC } from "react";
import clsx from "clsx";
import {
    TRPCProvider,
    SessionProviderWrapper,
} from "@khenzii-dev/providers";
import style from "@khenzii-dev/styles/layout.module.scss";

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
    <TRPCProvider>
        <SessionProviderWrapper>
            <html lang="en">
                <body className={clsx(style.layout, montserrat.className)}>
                    {children}
                </body>
            </html>
        </SessionProviderWrapper>
    </TRPCProvider>
);

export default RootLayout;
