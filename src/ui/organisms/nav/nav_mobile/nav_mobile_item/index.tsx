import { type FC } from "react";
import { type route } from "../..";
import { Flex } from "@khenzii-dev/ui/atoms";
import Link from "next/link";
import style from "./index.module.scss";
import clsx from "clsx";

export type NavMobileItemProps = {
    route: route;
    active?: boolean;
};

export const NavMobileItem: FC<NavMobileItemProps> = ({ route, active = false }) => (
    <Flex align={"center"} justify={"center"} styles={{ width: "auto" }}>
        <Link href={route.path} className={clsx([style.link, {[style.active as string]: active}])}>{route.name}</Link>
    </Flex>
);
