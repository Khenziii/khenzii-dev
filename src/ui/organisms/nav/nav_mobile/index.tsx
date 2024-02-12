import { type FC } from "react";
import { type route } from "..";
import { NavMobileItem } from "./nav_mobile_item";
import { useRouter } from "next/router";

export type NavMobileProps = {
    routes: route[];
};

export const NavMobile: FC<NavMobileProps> = ({ routes }) => {
    const router = useRouter();

    return (
        <>
            {routes.map((r, index) => (
                <NavMobileItem route={r} key={`nav-mobile-item-${index}`} active={router.pathname === r.path} />
            ))}
        </>
    );
};
