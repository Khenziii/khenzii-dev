import { type BlogTag } from "@khenzii-dev/server/backend";
import { type UITag } from "@khenzii-dev/ui/organisms";

// Returns only tags that have an ID present in the passed string array.
export const filterTagsByIds = (
    ids: string[],
    tags: BlogTag[] | undefined,
): BlogTag[] => {
    if (!tags) return [];

    return tags.filter((tag) => ids.includes(tag.id));
};

export const blogTagToUiTag = (
    ids: string[],
    tags: BlogTag[] | undefined,
): UITag[] => {
    if (!tags) return [];

    return tags.map((tag) => ({
        ...tag,
        active: ids.includes(tag.id),
    }));
};

export const uiTagToBlogTag = (
    uiTags: UITag[],
    blogTags: BlogTag[] | undefined,
): BlogTag[] => {
    if (!blogTags) return [];

    return (uiTags.map((uiTag) => {
        if (!uiTag.active) return;

        const blogTag = blogTags.find((blogTag) => blogTag.name === uiTag.name);
        return blogTag;
    }).filter(tag => tag !== undefined)) as BlogTag[];
};
