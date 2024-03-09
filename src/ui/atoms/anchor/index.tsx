import Link from "next/link";
import { type ReactNode, type FC } from "react";
import { type CustomStyles } from "@khenzii-dev/ui/types";
import clsx from "clsx";
import style from "./index.module.scss";

export type AnchorProps = {
    href: string;
    newTab?: boolean;
    prefetch?: boolean;
    children?: ReactNode;
    darkenOnHover?: boolean;
} & CustomStyles;

export const Anchor: FC<AnchorProps> = ({ newTab, children, className, darkenOnHover, ...props }) => (
    <Link
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noreferrer noopener" : undefined}
        className={clsx([className], [style.anchor], { [style.darkenOnHover as string]: darkenOnHover })}
        {...props}
    >
        {children}
    </Link>
);
