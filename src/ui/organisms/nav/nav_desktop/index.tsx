import { type FC } from "react";
import { type route, type social } from "..";
import style from "./index.module.scss";
import { NavDesktopItem } from "./nav_desktop_item";
import { Icon, Anchor } from "@khenzii-dev/ui/atoms";
import { usePathname } from "next/navigation";
import { Expandable } from "@khenzii-dev/ui/molecules";

export type NavDesktopProps = {
    routes: route[];
    socials: social[];
};

export const NavDesktop: FC<NavDesktopProps> = ({ routes , socials}) => {
    const pathname = usePathname();

    return (
        <div className={style.container}>
            <Expandable
                startHeight={"auto"}
                startWidth={"auto"}
                endHeight={"calc(2 * 75px - 10px)"} // 2 times $navDesktopHeight - padding
                endWidth={"min(calc(100vw - 2 * 10px), 1500px)"}
                openElement={
                    <NavDesktopItem route={{name: "socials"}} key={`nav-desktop-item-socials`} />
                }
                closeElement={
                    <button className={style.closeIcon}>
                        <Icon iconName={"x-lg"}/>
                    </button>
                }
                wrapOutOfFlow={true}
                keepOpenElementVisible={true}
            >
                <div className={style.socialContainer}>
                    {socials.map((s, index) => (
                        <Anchor className={style.social} href={s.url} key={`nav-desktop-social-${index}`} prefetch={false} newTab>
                            <Icon iconName={s.iconName} size={4} />
                        </Anchor>
                    ))}
                </div>
            </Expandable>

            {routes.map((r, index) => (
                <NavDesktopItem route={r} key={`nav-desktop-item-${index}`} active={pathname === r.path} />
            ))}
        </div>
    );
};
