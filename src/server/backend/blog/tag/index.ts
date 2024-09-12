import { BaseService } from "@khenzii-dev/server/backend";
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
        return await this.ctx.db.tag.update({
            where: { id: input.id },
            data: {
                ...currentTag,
                ...input.updatedTag,
            },
        });
    }

    async deleteTag(input: deleteTagInputType) {
        await this.ctx.db.tag.delete({
            where: {
                id: input.id,
            },
        });
    }
}
