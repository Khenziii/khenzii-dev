import {
    type FC,
    useState,
    useCallback,
    useContext,
} from "react";
import { usePathname } from "next/navigation";
import { IsNotFoundContext } from "@khenzii-dev/providers";
import type { route, social } from "..";
import { NavDesktopItem } from "./nav_desktop_item";
import { Icon, Anchor, Flex } from "@khenzii-dev/ui/atoms";
import { Expandable } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";

export type NavDesktopProps = {
    routes: route[];
    socials: social[];
};

export const NavDesktop: FC<NavDesktopProps> = ({ routes , socials }) => {
    const pathname = usePathname();
    const [areSocialsOpen, setAreSocialsOpen] = useState(false);
    const { isNotFound } = useContext(IsNotFoundContext);
    
    const isRouteActive = useCallback((path?: string): boolean => {
        if (isNotFound) return false;
        if (!path) return false;

        if (path === "/") return pathname === path;
   
        return pathname.startsWith(path);
    }, [isNotFound, pathname]);

    return (
        <div className={style.container}>
            <div style={{ position: "relative" }}>
                <div onClick={() => setAreSocialsOpen(true)} style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                    <NavDesktopItem route={{ name: "socials" }} key={`nav-desktop-item-socials`} />
                </div>

                <div style={{ position: "absolute", top: 0, left: 0 }}>
                    <Expandable
                        wrapOutOfFlow={true}
                        isExpanded={areSocialsOpen}
                    >
                        <Flex
                            direction={"column"}
                            align={"flex-start"}
                            justify={"flex-start"}
                            gap={0}
                            className={style.expandContainer}
                        >
                            <button className={style.closeIcon} onClick={() => setAreSocialsOpen(false)}>
                                <Icon iconName={"x-lg"}/>
                            </button>

                            <div className={style.socialContainer}>
                                {socials.map((s, index) => (
                                    <Anchor className={style.social} href={s.url} key={`nav-desktop-social-${index}`} prefetch={false} newTab>
                                        <Icon iconName={s.iconName} size={4}/>
                                    </Anchor>
                                ))}
                            </div>
                        </Flex>
                    </Expandable>
                </div>
            </div>

            {routes.map((r, index) => (
                <NavDesktopItem route={r} key={`nav-desktop-item-${index}`} active={isRouteActive(r.path)}/>
            ))}
        </div>
    );
};
