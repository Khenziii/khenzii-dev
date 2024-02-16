import { type FC } from "react";
import { type route } from "..";
import style from "./index.module.scss";
import { NavMobileItem } from "./nav_mobile_item";
import { Flex } from "@khenzii-dev/ui/atoms";
import { usePathname } from "next/navigation";

export type NavMobileProps = {
    routes: route[];
};

export const NavMobile: FC<NavMobileProps> = ({ routes }) => {
    const pathname = usePathname();

    return (
        <Flex align={"center"} justify={"space-around"} className={style.container}>
            {routes.map((r, index) => (
                <NavMobileItem route={r} key={`nav-mobile-item-${index}`} active={pathname === r.path} />
            ))}
        </Flex>
    );
};
