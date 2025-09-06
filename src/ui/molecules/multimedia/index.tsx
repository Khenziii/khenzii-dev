import type { FC, ReactNode } from "react";
import { Flex, Paragraph } from "@khenzii-dev/ui/atoms";
import styles from "./index.module.scss";

export type MultimediaProps = {
    children: ReactNode;
    additionalText?: string;
    sizeMultiplier?: number;
};

export const Multimedia: FC<MultimediaProps> = ({ children, additionalText, sizeMultiplier = 1 }) => (
    <Flex direction={"column"} align={"center"} className={styles["multimedia-container"]} gap={10}>
        {children}

        {additionalText && (
            <Paragraph
                fontSize={1 * sizeMultiplier}
                styles={{ fontStyle: "italic", textAlign: "center", fontWeight: 500 }}
            >
                {additionalText}
            </Paragraph>
        )}
    </Flex>

);
