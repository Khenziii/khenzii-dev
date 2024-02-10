import { type FC } from "react";
import { type route } from "../..";
import style from "./index.module.scss";

export type NavDesktopItemProps = {
    route: route;
};

export const NavDesktopItem: FC<NavDesktopItemProps> = ({ route }) => (
    <>
        <a href={route.path} className={style.link}>{route.name}</a>
    </>
);
