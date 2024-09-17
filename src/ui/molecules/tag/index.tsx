import {
    useState,
    type FC,
} from "react";
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
    const [isActive, setIsActive] = useState(active);

    return (
        <div
            onClick={() => {
                setIsActive((e) => !e);

                if (onClick !== undefined) onClick();
            }}
            className={clsx(style.tag, { [style.active as string]: isActive })}
        >
            <Paragraph fontSize={size}>{name}</Paragraph>
        </div>
    );
};
