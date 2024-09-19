import { type BlogTag } from "@khenzii-dev/server/backend";
import { type UITag } from "@khenzii-dev/ui/organisms";
import {
    filterTagsByIds,
    blogTagToUiTag,
    uiTagToBlogTag,
} from "@khenzii-dev/utils";

describe("Tags Utility Functions", () => {
    it("`filterTagsByIds` filters as expected", () => {
        const ids: string[] = ["id"];
        const tags: BlogTag[] = [
            {
                name: "test-tag",
                id: "id",
            },
            {
                name: "another-test-tag",
                id: "another-id",
            },
        ];

        const result = filterTagsByIds(ids, tags);
        expect(result).toEqual([
            {
                name: "test-tag",
                id: "id",
            },
        ]);
    });

    it("`blogTagToUiTag` converts the types as expected", () => {
        const ids: string[] = ["second-test-tag-id"];
        const tags: BlogTag[] = [
            {
                name: "test-tag",
                id: "test-tag-id",
            },
            {
                name: "second-test-tag",
                id: "second-test-tag-id",
            },
        ];

        const result = blogTagToUiTag(ids, tags);
        expect(result).toEqual([
            {
                name: "test-tag",
                id: "test-tag-id",
                active: false,
            },
            {
                name: "second-test-tag",
                id: "second-test-tag-id",
                active: true,
            },
        ]);
    });

    it("`uiTagToBlogTag` converts the types as expected", () => {
        const uiTags: UITag[] = [
            {
                name: "test-tag",
                active: false,
            },
            {
                name: "second-test-tag",
                active: true,
            },
            {
                name: "yet-another-test-tag",
                active: true,
            },
        ];
        const blogTags: BlogTag[] = [
            {
                name: "yet-another-test-tag",
                id: "some-id",
            },
        ];

        const result = uiTagToBlogTag(uiTags, blogTags);
        expect(result).toEqual([
            {
                name: "yet-another-test-tag",
                id: "some-id",
            },
        ]);
    });
});

