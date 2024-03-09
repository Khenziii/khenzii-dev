import type { CSSProperties, FC } from 'react';
import "bootstrap-icons/font/bootstrap-icons.min.css";
import type { IconName } from "../../types/icon-name";

export type IconProps = {
    iconName: IconName;
    size?: number;
    color?: string;
};

export const Icon: FC<IconProps> = ({ iconName, size = 2, color = "#FFFFFF" }) => {
    const style: CSSProperties = {};
    style.fontSize = `${size}rem`;
    style.color = color;

    return <i style={style} className={`bi bi-${iconName}`} />;
};
