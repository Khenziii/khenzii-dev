import { BaseService, Event } from "@khenzii-dev/server/backend";
import { z } from "zod";

export const createTagInput = z.object({
    name: z.string(),
});

export const updateTagInput = z.object({
    id: z.string(),
    updatedTag: z.object({
        name: z.string(),
    }),
});

export const deleteTagInput = z.object({
    id: z.string(),
});

type createTagInputType = z.infer<typeof createTagInput>;
type updateTagInputType = z.infer<typeof updateTagInput>;
type deleteTagInputType = z.infer<typeof deleteTagInput>;

export type BlogTag = {
    name: string;
    id: string;
};

export class BlogTagService extends BaseService {
    async getTags(): Promise<BlogTag[]> {
        return await this.ctx.db.tag.findMany();
    }

    async createTag(input: createTagInputType): Promise<BlogTag> {
        const event = new Event()
            .setTitle("Created a tag")
            .setJson({ name: input.name });
        await event.create();

        return await this.ctx.db.tag.create({
            data: {
                name: input.name,
            },
        });
    }

    async updateTag(input: updateTagInputType): Promise<BlogTag> {
        const currentTag = await this.ctx.db.tag.findUnique({
            where: { id: input.id },
        });
        const mergedTag = {
            ...currentTag,
            ...input.updatedTag,
        };
        // exclude the `id` field from `mergedTag`.
        const { id, ...newTag } = mergedTag;

        const event = new Event()
            .setTitle("Updated an tag")
            .setJson({
                currentTag,
                newTag,
            });
        await event.create();

        return await this.ctx.db.tag.update({
            where: { id: input.id },
            data: newTag,
        });
    }

    async deleteTag(input: deleteTagInputType) {
        const deletedTag = await this.ctx.db.tag.findUnique({
            where: { id: input.id },
        });
        if (!deletedTag) return;

        const event = new Event()
            .setTitle("Deleted a tag")
            .setJson(deletedTag);
        await event.create();

        await this.ctx.db.tag.delete({
            where: {
                id: input.id,
            },
        });
    }
}
