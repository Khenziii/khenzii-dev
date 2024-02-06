import { Montserrat } from "next/font/google";
import React from "react";
import style from "../styles/layout.module.scss";
import clsx from "clsx";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export const metadata = {
  title: "Khenzii :)",
  description: "Khenzii's portfolio.",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(montserrat.className, style.layout)}>{children}</body>
    </html>
  );
}
