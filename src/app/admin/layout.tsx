import type { ReactNode, FC } from "react";
import { type Metadata } from "next";
import { Flex, Anchor, Icon } from "@khenzii-dev/ui/atoms";
import type { IconName } from "@khenzii-dev/ui/types";
import { ProtectedPage } from "@khenzii-dev/ui/organisms";
import style from "@khenzii-dev/styles/layout_admin.module.scss";

export const metadata: Metadata = {
    title: "Admin Panel",
};

type adminRoute = {
    iconName: IconName;
    path: string;
};

const adminRoutes: adminRoute[] = [
    {
        path: "",
        iconName: "person-fill",
    },
    {
        path: "current-project",
        iconName: "pin-fill",
    },
    {
        path: "blog",
        iconName: "card-text",
    },
    {
        path: "event-log",
        iconName: "clock-history",
    },
];

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => (
    <main className={style.content}>
        <ProtectedPage>
            <Flex gap={20}>
                {adminRoutes.map((route, index) => (
                    <Anchor
                        href={`/admin/${route.path}`}
                        key={`admin-nav-${index}`}
                        className={style.link}
                        prefetch
                    >
                        <Icon iconName={route.iconName} size={2} />                       
                    </Anchor>
                ))}
            </Flex>
            
            {children}
        </ProtectedPage>
    </main>
);

export default AdminLayout;
