import { type FC } from "react";
import clsx from "clsx";
import { Paragraph } from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";

export type TagProps = {
    name: string;
    onClick?: () => void;
    active?: boolean;
    size?: number;
};

export const Tag: FC<TagProps> = ({ name, onClick, active = false, size = 2 }) => {
    return (
        <div
            onClick={onClick}
            className={clsx(style.tag, { [style.active as string]: active })}
        >
            <Paragraph fontSize={size}>{name}</Paragraph>
        </div>
    );
};
