"use client";

import {
    useCallback,
    useState,
    type FC,
} from "react";
import { Flex } from "@khenzii-dev/ui/atoms";
import { Tag } from "@khenzii-dev/ui/molecules";

const toggleActiveByName = (tagArray: TagType[], name: string) => {
    return tagArray.map((tag) => 
        tag.name == name
            ? { ...tag, active: !tag.active }
            : tag
    );
};

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
    const [currentTags, setCurrentTags] = useState(tags);

    const handleTagClick = useCallback((tagName: string) => {
        setCurrentTags((prev) => toggleActiveByName(prev, tagName));

        if (onClick !== undefined) onClick(currentTags);
    }, [onClick, currentTags]);

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

