import { type FC } from "react";
import { type route, type social } from "..";
import style from "./index.module.scss";
import { NavMobileItem } from "./nav_mobile_item";
import { usePathname } from "next/navigation";
import { Icon, Anchor } from "@khenzii-dev/ui/atoms";
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
                    <NavMobileItem route={{ name: "socials" }} key={`nav-mobile-item-socials`} />
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
                        <Anchor className={style.social} href={s.url} key={`nav-mobile-social-${index}`} prefetch={false} newTab>
                            <Icon iconName={s.iconName} size={4} />
                        </Anchor>
                    ))}
                </div>
            </Expandable>

            {routes.map((r, index) => (
                <NavMobileItem route={r} key={`nav-mobile-item-${index}`} active={pathname === r.path} />
            ))}
        </div>
    );
};
