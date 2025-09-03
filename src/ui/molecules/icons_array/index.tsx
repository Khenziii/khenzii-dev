import { type ElementType, type FC } from "react";
import { type IconName } from "@khenzii-dev/ui/types";
import { type FlexDirection, Icon, Flex } from "@khenzii-dev/ui/atoms";

export type IconsArrayProps = {
    icons: (IconName | ElementType)[];
    direction?: FlexDirection;
};

export const IconsArray: FC<IconsArrayProps> = ({ icons, direction = "row" }) => (
    <Flex direction={direction}>
        {icons.map((PassedIcon, index) => {
            const key = `icon-${index}`;

            if (typeof PassedIcon === "string") return (
                <Icon iconName={PassedIcon as IconName} key={key} />
            );

            return <PassedIcon key={key} />;
        })}
    </Flex>
);
