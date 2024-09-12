import { BaseService } from "@khenzii-dev/server/backend";

export type BlogTag = {
    name: string;
    id: string;
};

export class BlogTagService extends BaseService {
    async getTags(): Promise<BlogTag[]> {
        return [{ name: "...", id: "..." }];
    }

    async createTag(): Promise<BlogTag> {
        return { name: "...", id: "..." };
    }

    async updateTag(): Promise<BlogTag> {
        return { name: "...", id: "..." };
    }

    async deleteTag() {}
}
