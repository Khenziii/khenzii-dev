import { type ElementType, type FC } from "react";
import { type IconName } from "@khenzii-dev/ui/types";
import { Icon } from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";

export type IconsArrayProps = {
    icons: (IconName | ElementType)[];
};

export const IconsArray: FC<IconsArrayProps> = ({ icons }) => (
    <div className={style.container}>
        {icons.map((PassedIcon, index) => {
            const key = `icon-${index}`;

            if (typeof PassedIcon === "string") return (
                <Icon iconName={PassedIcon as IconName} key={key} />
            );

            return <PassedIcon key={key} />;
        })}
    </div>
);
