import type { FC, ReactNode } from "react";
import { Flex, Button, Icon, Paragraph } from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";
import clsx from "clsx";

export type DialogProps = {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
    title: string;
};

export const Dialog: FC<DialogProps> = ({ children, open, onClose, title }) => (
    <div
        className={clsx([style.overlay], {
            [style.visible as string]: open,
        })}
        onClick={onClose}
    >
        <dialog
            className={style.dialog}
            open={open}
        >
            <Flex direction={"column"}>
                <Flex justify={"space-around"} align={"center"}>
                    <Paragraph fontSize={1.5}>{title}</Paragraph>

                    <Button onClick={onClose}>
                        <Icon iconName={"x-lg"} size={1.5}/>
                    </Button>
                </Flex>

                {children}
            </Flex>
        </dialog>
    </div>
);
