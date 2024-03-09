import { type FC } from "react";
import { type route } from "../..";
import { Flex, Paragraph, Anchor } from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";
import clsx from "clsx";

export type NavMobileItemProps = {
    route: route;
    active?: boolean;
};

export const NavMobileItem: FC<NavMobileItemProps> = ({ route, active = false }) => (
    <Flex align={"center"} justify={"center"} styles={{ width: "auto", height: "100%" }}>
        {route.path ? (
            <Anchor href={route.path} className={clsx([style.link, { [style.active as string]: active }])} prefetch>{route.name}</Anchor>
        ) : (
            <Paragraph className={clsx([style.link], { [style.active as string]: active })} fontSize={1.5} styles={{ cursor: "pointer" }}>{route.name}</Paragraph>
        )}
    </Flex>
);
