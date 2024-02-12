import { type FC } from "react";
import { type route } from "../..";
import Link from "next/link";
import style from "./index.module.scss";
import clsx from "clsx";

export type NavDesktopItemProps = {
    route: route;
    active?: boolean;
};

export const NavDesktopItem: FC<NavDesktopItemProps> = ({ route, active = false }) => (
    <>
        <Link href={route.path} className={clsx([style.link], {[style.active as string]: active})}>{route.name}</Link>
    </>
);
