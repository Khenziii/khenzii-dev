"use client";

import { type FC, useState } from "react";
import { Paragraph, Flex, Icon } from "@khenzii-dev/ui/atoms";
import { type IconName } from "@khenzii-dev/ui/types/icon-name";
import { Expandable } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";

export type option = {
    text: string;
    iconName: IconName;
};

export type SelectProps = {
    options: option[];
    setCurrentOption: (item: option) => void;
    currentOption: option;
    fontSize?: number;
    openedByDefault?: boolean;
    animationDuration?: number;
    width?: string;
};

export const Select: FC<SelectProps> = ({ options, setCurrentOption, currentOption, fontSize = 2, openedByDefault = false, animationDuration = 0.5, width = "fit-content" }) => {
    const [isFocused, setIsFocused] = useState(openedByDefault);

    return (
        <Flex
            direction={"column"}
            gap={0}
            styles={{ width: width }}
        >
            <Flex
                direction={"row"}
                align={"center"}
                className={style.currentChoiceContainer}
                justify={"space-between"}
            >
                <Paragraph fontSize={fontSize}>
                    {currentOption.text}
                </Paragraph>

                <div
                    className={style.darkenChildOnHover}
                    onClick={() => setIsFocused((e) => !e)}
                >
                    <Icon
                        iconName={
                            isFocused
                                ? "arrow-up-short"
                                : "arrow-down-short"
                        }
                        size={fontSize + 0.5} // Above icons have a bunch of padding, thus the 0.5 adjustment
                    />
                </div>
            </Flex>

            <Expandable
                isExpanded={isFocused}
                animationDuration={animationDuration}
                inDirection={"top"}
                exitDirection={"top"}
            >
                {options.filter(item => item != currentOption).map((item, index) => (
                    <div
                        onClick={() => {
                            setCurrentOption(item);
                            setIsFocused(false);
                        }}
                        key={`select-item-${index}`}
                    >
                        <Flex
                            className={style.optionWrapper}
                            direction={"row"}
                        >
                            <Icon iconName={item.iconName} size={fontSize * 0.75}/>

                            <Paragraph fontSize={fontSize * 0.75}>
                                {item.text}
                            </Paragraph>
                        </Flex>
                    </div>
                ))}
            </Expandable>
        </Flex>
    );
};
