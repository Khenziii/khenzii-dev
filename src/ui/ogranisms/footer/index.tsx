import { type FC } from "react";
import style from "./index.module.scss";
import { Flex, Paragraph } from "@khenzii-dev/ui/atoms";

export type FooterProps = {};

export const Footer: FC<FooterProps> = ({}) => (
    <Flex align={"center"} justify={"space-between"} className={style.container} fullWidth>
        <Paragraph>
            Made with 🤍 by Khenzii
        </Paragraph>

        <Paragraph>
            All of the code is available in <a href={"https://github.com/Khenziii/khenzii-dev"}>website's github repo</a>. Licensed under <a href={"https://github.com/Khenziii/khenzii-dev/blob/master/LICENSE"}>CC-BY-SA-4.0</a>.
        </Paragraph>
    </Flex>
);
