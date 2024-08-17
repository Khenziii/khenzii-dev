import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode, FC } from "react";
import { TRPCProvider } from "@khenzii-dev/providers";
import style from "@khenzii-dev/styles/layout_admin.module.scss";
import clsx from "clsx";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Admin Panel | Khenzii",
        template: "%s | Admin Panel | Khenzii",
    },
    description: "Khenzii's portfolio.",
    icons: [{ rel: "icon", url: "/logo.svg" }],
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <TRPCProvider>
        <html lang="en">
            <body className={clsx(style.layout, montserrat.className)}>
                <main className={style.content}>
                    {children}
                </main>
            </body>
        </html>
    </TRPCProvider>
);

export default RootLayout;
