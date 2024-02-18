import { type FC } from "react";
import { type route, type social } from "..";
import style from "./index.module.scss";
import { NavDesktopItem } from "./nav_desktop_item";
import { Icon } from "@khenzii-dev/ui/atoms";
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
                {socials.map((s, index) => (
                    <a className={style.social} href={s.url} key={`nav-desktop-social-${index}`}>
                        <Icon iconName={s.iconName}/>
                    </a>
                ))}
            </Expandable>

            {routes.map((r, index) => (
                <NavDesktopItem route={r} key={`nav-desktop-item-${index}`} active={pathname === r.path} />
            ))}
        </div>
    );
};
