import { type FC } from "react";
import { type route } from "../..";
import style from "./index.module.scss";
import clsx from "clsx";
import { Paragraph, Flex, Anchor } from "@khenzii-dev/ui/atoms";

export type NavDesktopItemProps = {
    route: route;
    active?: boolean;
};

export const NavDesktopItem: FC<NavDesktopItemProps> = ({route, active = false}) => (
    <Flex align={"center"} justify={"center"} styles={{ width: "auto", height: "100%" }}>
        {route.path ? (
            <Anchor href={route.path} className={clsx([style.link], {[style.active as string]: active})} prefetch>{route.name}</Anchor>
        ) : (
            <Paragraph className={clsx([style.link], {[style.active as string]: active})} fontSize={2} styles={{cursor: "pointer"}}>{route.name}</Paragraph>
        )}
    </Flex>
);
