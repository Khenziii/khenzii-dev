"use client";

import {
    useCallback,
    type FC,
} from "react";
import { Flex } from "@khenzii-dev/ui/atoms";
import { Tag } from "@khenzii-dev/ui/molecules";

export type UITag = {
    active: boolean;
    name: string;
};

export type TagsProps = {
    tags: UITag[];
    onClick?: (tags: UITag[]) => void;
    size?: number;
    clickable?: boolean;
    showOnlyActive?: boolean;
};

export const Tags: FC<TagsProps> = ({ tags, onClick, size, clickable, showOnlyActive = false }) => {
    const handleTagClick = useCallback((name: string) => {
        // Changes tag's active state by name.
        const updatedTags = tags.map((tag) => 
            tag.name === name
                ? { ...tag, active: !tag.active }
                : tag
        );

        if (onClick !== undefined) onClick(updatedTags);
    }, [tags, onClick]);

    return (
        <Flex direction={"row"} styles={{ flexWrap: "wrap" }}>
            {tags.map((tag, index) => (
                !(showOnlyActive && !tag.active) && (
                    <Tag
                        key={`tag-${index}`}
                        name={tag.name}
                        active={tag.active}
                        onClick={() => handleTagClick(tag.name)}
                        size={size}
                        clickable={clickable}
                    />
                )
            ))}
        </Flex>
    );
};

