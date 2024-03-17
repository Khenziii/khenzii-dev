import { type FC, useState } from "react";
import { type route, type social } from "..";
import style from "./index.module.scss";
import { NavDesktopItem } from "./nav_desktop_item";
import { Icon, Anchor, Flex } from "@khenzii-dev/ui/atoms";
import { usePathname } from "next/navigation";
import { Expandable } from "@khenzii-dev/ui/molecules";

export type NavDesktopProps = {
    routes: route[];
    socials: social[];
};

export const NavDesktop: FC<NavDesktopProps> = ({ routes , socials }) => {
    const pathname = usePathname();
    const [areSocialsOpen, setAreSocialsOpen] = useState(false);

    return (
        <div className={style.container}>
            <div style={{ position: "relative" }}>
                <div onClick={() => setAreSocialsOpen(true)} style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                    <NavDesktopItem route={{ name: "socials" }} key={`nav-desktop-item-socials`} />
                </div>

                <div style={{ position: "absolute", top: 0, left: 0 }}>
                    <Expandable
                        startHeight={"0"}
                        startWidth={"0"}
                        // endHeight={"calc(2 * 75px - 10px)"}
                        // endWidth={"min(calc(100vw - 2 * 10px - 1px * 4), calc(1500px - 10px * 2 - 1px * 4))"} // 10px * 2 = both paddings, 1px * 4 = borders
                        endHeight={"140px"}
                        endWidth={"1476px"}
                        wrapOutOfFlow={true}
                        isExpanded={areSocialsOpen}
                    >
                        <Flex direction={"column"} align={"flex-start"} justify={"flex-start"} gap={0} styles={{ height: "100%", width: "100%" }}>
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
                <NavDesktopItem route={r} key={`nav-desktop-item-${index}`} active={pathname === r.path}/>
            ))}
        </div>
    );
};
