import * as icons from 'react-bootstrap-icons';

export type iconName = keyof typeof icons;

export type IconProps = Omit<icons.IconProps, "size" | "color"> & {
    iconName: iconName;
    size?: number;
    color?: string;
}

export const Icon = ({ iconName, size = 2, color = "#FFFFFF", ...props }: IconProps) => {
    const BootstrapIcon = icons[iconName];
    return <BootstrapIcon fontSize={`${size}rem`} color={color} {...props} />;
}