import { type FC, useState } from "react";
import { type route, type social } from "..";
import style from "./index.module.scss";
import { NavMobileItem } from "./nav_mobile_item";
import { usePathname } from "next/navigation";
import { Icon, Anchor, Flex } from "@khenzii-dev/ui/atoms";
import { Expandable } from "@khenzii-dev/ui/molecules";

export type NavMobileProps = {
    routes: route[];
    socials: social[];
};

export const NavMobile: FC<NavMobileProps> = ({ routes, socials }) => {
    const pathname = usePathname();
    const [areSocialsOpen, setAreSocialsOpen] = useState(false);

    return (
        <div className={style.container}>
            <div style={{ position: "relative" }}>
                <div onClick={() => setAreSocialsOpen(true)} style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                    <NavMobileItem route={{ name: "socials" }} key={`nav-mobile-item-socials`} />
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
                            styles={{
                                height: "auto",
                                width: "calc(100vw - 2 * 10px - 2 * 1px)",
                            }}
                        >
                            <button className={style.closeIcon} onClick={() => setAreSocialsOpen(false)}>
                                <Icon iconName={"x-lg"}/>
                            </button>

                            <div className={style.socialContainer}>
                                {socials.map((s, index) => (
                                    <Anchor className={style.social} href={s.url} key={`nav-mobile-social-${index}`} prefetch={false} newTab>
                                        <Icon iconName={s.iconName} size={4}/>
                                    </Anchor>
                                ))}
                            </div>
                        </Flex>
                    </Expandable>
                </div>
            </div>

            {routes.map((r, index) => (
                <NavMobileItem route={r} key={`nav-mobile-item-${index}`} active={pathname === r.path}/>
            ))}
        </div>
    );
};
