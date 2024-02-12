import { type FC } from "react";
import { type route } from "../..";
import Link from "next/link";
import style from "./index.module.scss";
import clsx from "clsx";

export type NavMobileItemProps = {
    route: route;
    active?: boolean;
};

export const NavMobileItem: FC<NavMobileItemProps> = ({ route, active = false }) => (
    <Link href={route.path} className={clsx([style.link, {[style.active as string]: active}])}>{route.name}</Link>
);
