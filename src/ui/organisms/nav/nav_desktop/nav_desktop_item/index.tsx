import { type FC } from "react";
import { type route } from "../..";
import Link from "next/link";
import style from "./index.module.scss";
import clsx from "clsx";
import { Paragraph } from "@khenzii-dev/ui/atoms";

export type NavDesktopItemProps = {
    route: route;
    active?: boolean;
};

export const NavDesktopItem: FC<NavDesktopItemProps> = ({ route, active = false }) => (
    (route.path ? (
        <Link href={route.path} className={clsx([style.link], {[style.active as string]: active})}>{route.name}</Link>
    ) : (
        <Paragraph className={clsx([style.link], {[style.active as string]: active})} fontSize={2} styles={{cursor: "pointer"}}>{route.name}</Paragraph>
    ))
);
