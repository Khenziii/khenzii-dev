"use client";

export * from "./select_context";

import { type FC, useState, useContext } from "react";
import { Paragraph, Flex, Icon } from "@khenzii-dev/ui/atoms";
import { type IconName } from "@khenzii-dev/ui/types/icon-name";
import { Expandable } from "@khenzii-dev/ui/molecules";
import style from "./index.module.scss";
import { SelectContext } from "./select_context";

export type option = {
    text: string;
    iconName: IconName;
};

export type SelectProps = {
    options: option[];
    fontSize?: number;
    openedByDefault?: boolean;
    animationDuration?: number;
    width?: string;
};

export const Select: FC<SelectProps> = ({ options, fontSize = 2, openedByDefault = false, animationDuration = 0.5, width = "fit-content" }) => {
    const [isFocused, setIsFocused] = useState(openedByDefault);
    const { currentSortOption, setCurrentSortOption }= useContext(SelectContext);

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
                    {currentSortOption.text}
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
                {options.filter(item => item != currentSortOption).map((item, index) => (
                    <div
                        onClick={() => {
                            setCurrentSortOption(item);
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
