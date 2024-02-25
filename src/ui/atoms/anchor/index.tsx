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
} & CustomStyles;

export const Anchor: FC<AnchorProps> = ({ newTab, children, className, ...props }) => (
    <Link
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noreferrer noopener" : undefined}
        className={clsx([className], [style.anchor])}
        {...props}
    >
        {children}
    </Link>
)
