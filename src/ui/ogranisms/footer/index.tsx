import { type FC } from "react";
import style from "./index.module.scss";
import clsx from "clsx";
import { Flex } from "@khenzii-dev/ui/atoms";

export type FooterProps = {};

export const Footer: FC<FooterProps> = ({}) => (
    <Flex direction={"column"} gap={10} align={"center"}>
        <p>
            Made with 🤍 by Khenzii
        </p>

        <p>
            All of the code is available in <a href={"https://github.com/Khenziii/khenzii-dev"}>website's github repo</a>. Licensed under <a href={"https://github.com/Khenziii/khenzii-dev/blob/master/LICENSE"}>CC-BY-SA-4.0</a>.
        </p>
    </Flex>
);
