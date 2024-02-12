import { type FC } from "react";
import { type route } from "../..";
import Link from "next/link";

export type NavMobileItemProps = {
    route: route;
    active?: boolean;
};

export const NavMobileItem: FC<NavMobileItemProps> = ({ route, active = false }) => (
    <>
        <Link href={route.path}>{route.name}</Link>
    </>
);
