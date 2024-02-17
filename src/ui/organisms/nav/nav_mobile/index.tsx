import { type FC } from "react";
import { type route, type social } from "..";
import style from "./index.module.scss";
import { NavMobileItem } from "./nav_mobile_item";
import { usePathname } from "next/navigation";
import { Icon } from "@khenzii-dev/ui/atoms";
import { Expandable } from "@khenzii-dev/ui/molecules";

export type NavMobileProps = {
    routes: route[];
    socials: social[];
};

export const NavMobile: FC<NavMobileProps> = ({ routes, socials }) => {
    const pathname = usePathname();

    return (
        <div className={style.container}>
            <Expandable
                startHeight={"auto"}
                startWidth={"auto"}
                endHeight={"50vh"}
                endWidth={"calc(100vw - 2 * 10px)"}
                openElement={
                    <NavMobileItem route={{name: "socials"}} key={`nav-mobile-item-socials`} />
                }
                closeElement={
                    <button className={style.closeIcon}>
                        <Icon iconName={"XLg"}/>
                    </button>
                }
                wrapOutOfFlow={true}
                keepOpenElementVisible={true}
            >
                <div className={style.socialContainer}>
                    {socials.map((s, index) => (
                        <a className={style.social} href={s.url} key={`nav-mobile-social-${index}`}>
                            <Icon iconName={s.iconName} size={3} />
                        </a>
                    ))}
                </div>
            </Expandable>

            {routes.map((r, index) => (
                <NavMobileItem route={r} key={`nav-mobile-item-${index}`} active={pathname === r.path} />
            ))}
        </div>
    );
};
