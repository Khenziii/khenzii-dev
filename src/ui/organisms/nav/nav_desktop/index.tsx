import { type FC } from "react";
import { type route } from "..";
import style from "./index.module.scss";
import { NavDesktopItem } from "./nav_desktop_item";
import { Flex } from "@khenzii-dev/ui/atoms";
import { usePathname } from "next/navigation";

export type NavDesktopProps = {
    routes: route[];
};

export const NavDesktop: FC<NavDesktopProps> = ({ routes }) => {
    const pathname = usePathname();

    return (
        <Flex align={"center"} justify={"space-around"} className={style.container}>
            {routes.map((r, index) => (
                <NavDesktopItem route={r} key={`nav-desktop-item-${index}`} active={pathname === r.path} />
            ))}
        </Flex>
    );
};
