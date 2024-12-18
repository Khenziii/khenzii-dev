import { BaseService, Event } from "@khenzii-dev/server/backend";
import { z } from "zod";

export const getPostInput = z.object({
    id: z.string(),
});

export const getPostsInput = z.object({
    offset: z.number().optional(),
    tags: z.object({
        id: z.string(),
    }).array().optional(),
}).optional();

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

type getPostInputType = z.infer<typeof getPostInput>;
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
    async getPost(input: getPostInputType): Promise<BlogPost | null> {
        try {
            return await this.ctx.db.post.findUnique({
                where: { id: input.id },
            });
        } catch {
            return null;
        }
    }

    async getPosts(input: getPostsInputType): Promise<BlogPost[]> {
        return await this.ctx.db.post.findMany({
            orderBy: { created_at: "desc" },
            skip: (input?.offset ?? 0) * 10,
            take: 10,
            where: input?.tags === undefined
                ? undefined
                : { tagIDs: { hasSome: input.tags.map((tag) => tag.id) } },
        });
    }

    async createPost(input: createPostInputType): Promise<BlogPost> {
        const event = new Event()
            .setTitle("Created a new post")
            .setJson({
                newPost: input, 
            });
        await event.create();

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

        const event = new Event()
            .setTitle("Updated an post")
            .setJson({
                currentPost,
                newPost,
            });
        await event.create();

        return await this.ctx.db.post.update({
            where: { id: input.id },
            data: newPost,
        });
    }

    async deletePost(input: deletePostInputType) {
        const deletedPost = await this.ctx.db.post.findUnique({
            where: { id: input.id },
        });
        if (!deletedPost) return;

        const event = new Event()
            .setTitle("Deleted a post")
            .setJson(deletedPost);
        await event.create();

        await this.ctx.db.post.delete({
            where: {
                id: input.id,
            },
        });
    }
}
