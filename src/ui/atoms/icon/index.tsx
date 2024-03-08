import type { CSSProperties, FC } from 'react'
import "bootstrap-icons/font/bootstrap-icons.scss";
import type { IconName } from "../../types/icon-name.type";

export type IconProps = {
    iconName: IconName;
    size?: number;
    color?: string;
}

export const Icon: FC<IconProps> = ({ iconName, size = 2, color = "#FFFFFF" }) => {
    const style: CSSProperties = {};
    style.fontSize = size;
    style.color = color;

    return <i style={style} className={`bi bi-${iconName}`} />;
}
