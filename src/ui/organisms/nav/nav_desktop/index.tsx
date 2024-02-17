import { type FC } from "react";
import { type route } from "..";
import style from "./index.module.scss";
import { NavDesktopItem } from "./nav_desktop_item";
import { Flex, Icon } from "@khenzii-dev/ui/atoms";
import { usePathname } from "next/navigation";
import { Expandable } from "@khenzii-dev/ui/molecules";

export type NavDesktopProps = {
    routes: route[];
};

export const NavDesktop: FC<NavDesktopProps> = ({ routes }) => {
    const pathname = usePathname();

    return (
        <Flex align={"center"} justify={"space-around"} className={style.container}>
            <Expandable
                startHeight={"auto"}
                startWidth={"auto"}
                endHeight={"auto"}
                endWidth={"auto"}
                openElement={
                    <NavDesktopItem route={{name: "socials"}} key={`nav-desktop-item-socials`} />
                }
                closeElement={
                    <button className={style.closeIcon}>
                        <Icon iconName={"XLg"}/>
                    </button>
                }
                wrapOutOfFlow={true}
                keepOpenElementVisible={true}
            >
                <p>hello!</p>
            </Expandable>

            {routes.map((r, index) => (
                <NavDesktopItem route={r} key={`nav-desktop-item-${index}`} active={pathname === r.path} />
            ))}
        </Flex>
    );
};
