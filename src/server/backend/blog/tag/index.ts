import { BaseService } from "@khenzii-dev/server/backend";

export type BlogTag = {
    name: string;
    id: string;
};

export class BlogTagService extends BaseService {
    async getTags(): Promise<BlogTag[]> {
        return await this.ctx.db.tag.findMany();
    }

    async createTag(): Promise<BlogTag | undefined> {
        if (!this.input) return;
        if (typeof this.input.name !== "string") return;

        return await this.ctx.db.tag.create({
            data: {
                name: this.input.name,
            },
        });
    }

    async updateTag(): Promise<BlogTag | undefined> {
        if (!this.input) return;
        if (typeof this.input.id !== "string") return;
        if (typeof this.input.updatedTag !== "object") return;

        const currentTag = await this.ctx.db.tag.findUnique({
            where: { id: this.input.id },
        });
        return await this.ctx.db.tag.update({
            where: { id: this.input.id },
            data: {
                ...currentTag,
                ...this.input.updatedTag,
            },
        });
    }

    async deleteTag() {
        if (!this.input) return;
        if (typeof this.input.id !== "string") return;
        
        await this.ctx.db.tag.delete({
            where: {
                id: this.input.id,
            },
        });
    }
}
