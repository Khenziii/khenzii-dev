"use client";

import {
    useCallback,
    type FC,
} from "react";
import { Flex } from "@khenzii-dev/ui/atoms";
import { Tag } from "@khenzii-dev/ui/molecules";

export type TagType = {
    active: boolean;
    name: string;
};

export type TagsProps = {
    tags: TagType[];
    onClick?: (tags: TagType[]) => void;
    size?: number;
};

export const Tags: FC<TagsProps> = ({ tags, onClick, size }) => {
    const handleTagClick = useCallback((name: string) => {
        // Changes tag's active state by name.
        const updatedTags = tags.map((tag) => 
            tag.name == name
                ? { ...tag, active: !tag.active }
                : tag
        );

        if (onClick !== undefined) onClick(updatedTags);
    }, [tags, onClick]);

    return (
        <Flex direction={"row"}>
            {tags.map((tag, index) => (
                <Tag
                    key={`tag-${index}`}
                    name={tag.name}
                    active={tag.active}
                    onClick={() => handleTagClick(tag.name)}
                    size={size}
                />
            ))}
        </Flex>
    );
};

