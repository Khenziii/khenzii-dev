import { Montserrat } from "next/font/google";
import React from "react";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"]
});

export const metadata = {
  title: "Khenzii :)",
  description: "Khenzii's portfolio.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
