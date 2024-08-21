import type { ReactNode, FC } from "react";
import { type Metadata } from "next";
import style from "@khenzii-dev/styles/layout_admin.module.scss";

export const metadata: Metadata = {
    title: "Admin Panel",
};

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <main className={style.content}>
        {children}
    </main>
);

export default AdminLayout;
