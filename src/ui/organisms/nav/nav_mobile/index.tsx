import { type FC } from "react";
import { type route } from "..";
import style from "./index.module.scss";
import { NavMobileItem } from "./nav_mobile_item";
import { usePathname } from "next/navigation";

export type NavMobileProps = {
    routes: route[];
};

export const NavMobile: FC<NavMobileProps> = ({ routes }) => {
    const pathname = usePathname();

    return (
        <div className={style.container}>
            {routes.map((r, index) => (
                <NavMobileItem route={r} key={`nav-mobile-item-${index}`} active={pathname === r.path} />
            ))}
        </div>
    );
};
