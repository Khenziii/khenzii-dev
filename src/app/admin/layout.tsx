import type { ReactNode, FC } from "react";
import { type Metadata } from "next";
import { Flex } from "@khenzii-dev/ui/atoms";
import { ProtectedPage } from "@khenzii-dev/ui/organisms";
import style from "@khenzii-dev/styles/layout_admin.module.scss";

export const metadata: Metadata = {
    title: "Admin Panel",
};

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <main className={style.content}>
        <ProtectedPage>
            <Flex
                direction="column"
                gap={20}
                className={style.container}
            >
                {children}
            </Flex>
        </ProtectedPage>
    </main>
);

export default AdminLayout;
