import { type FC } from "react";
import { type route } from "../..";
import Link from "next/link";

export type NavMobileItemProps = {
    route: route;
};

export const NavMobileItem: FC<NavMobileItemProps> = ({ route }) => (
    <>
        <Link href={route.path}>{route.name}</Link>
    </>
);
