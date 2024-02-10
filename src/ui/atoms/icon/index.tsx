import * as icons from 'react-bootstrap-icons';

export type IconProps = Omit<icons.IconProps, "size" | "color"> & {
    iconName: keyof typeof icons;
    size?: number;
    color?: string;
}

export const Icon = ({ iconName, size = 2, color = "#FFFFFF", ...props }: IconProps) => {
    const BootstrapIcon = icons[iconName];
    return <BootstrapIcon fontSize={`${size}rem`} color={color} {...props} />;
}