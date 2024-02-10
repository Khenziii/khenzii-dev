import { type FC } from "react";
import { type route } from "..";
import { NavMobileItem } from "./nav_mobile_item";

export type NavMobileProps = {
    routes: route[];
};

export const NavMobile: FC<NavMobileProps> = ({ routes }) => (
    <>
        {routes.map((r, index) => (
            <NavMobileItem route={r} key={`nav-mobile-item-${index}`} />
        ))}
    </>
);
