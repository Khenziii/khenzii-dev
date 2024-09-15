import { BaseService } from "@khenzii-dev/server/backend";
import { z } from "zod";

export const getPostsInput = z.object({
    offset: z.number().optional(),
});

export const createPostInput = z.object({
    title: z.string(),
    content: z.string(),
    created_at: z
        .string()
        .transform((string) => new Date(string)),
    tagIDs: z.array(z.string()),
});

export const updatePostInput = z.object({
    id: z.string(),
    updatedPost: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        created_at: z
            .string()
            .transform((string) => new Date(string))
            .optional(),
        tagIDs: z.array(z.string()).optional(),
    }),
});

export const deletePostInput = z.object({
    id: z.string(),
});

type getPostsInputType = z.infer<typeof getPostsInput>;
type createPostInputType = z.infer<typeof createPostInput>;
type updatePostInputType = z.infer<typeof updatePostInput>;
type deletePostInputType = z.infer<typeof deletePostInput>;

export type BlogPost = {
    id: string;
    title: string;
    content: string;
    created_at: Date;
    tagIDs: string[];
};

export class BlogPostService extends BaseService {
    async getPosts(input: getPostsInputType): Promise<BlogPost[]> {
        return await this.ctx.db.post.findMany({
            skip: (input.offset ?? 0) * 10,
            take: 10,
        });
    }

    async createPost(input: createPostInputType): Promise<BlogPost> {
        return await this.ctx.db.post.create({
            data: {
                title: input.title,
                content: input.content,
                created_at: input.created_at,
                tagIDs: input.tagIDs,
            },
        });
    }

    async updatePost(input: updatePostInputType): Promise<BlogPost> {
        const currentPost = await this.ctx.db.post.findUnique({
            where: { id: input.id },
        });
        const mergedPost = {
            ...currentPost,
            ...input.updatedPost,
        };
        // exclude the `id` field from `mergedPost`.
        const { id, ...newPost } = mergedPost;

        return await this.ctx.db.post.update({
            where: { id: input.id },
            data: newPost,
        });
    }

    async deletePost(input: deletePostInputType) {
        await this.ctx.db.post.delete({
            where: {
                id: input.id,
            },
        });
    }
}
