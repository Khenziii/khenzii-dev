import { type FC } from "react";
import style from "./index.module.scss";
import { Flex, Paragraph, Icon } from "@khenzii-dev/ui/atoms";

// export type FooterProps = {};

export const Footer: FC = () => (
    <Flex align={"center"} justify={"space-between"} className={style.container} fullWidth>
        <Paragraph className={style.leftItem}>
            Made with 🤍 by Khenzii
        </Paragraph>

        <a className={style.rightItem} href={"https://github.com/Khenziii/khenzii-dev/"}>
            <Icon iconName={"Github"} />
        </a>
    </Flex>
);
