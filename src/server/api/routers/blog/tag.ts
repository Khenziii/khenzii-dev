import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    BlogTagService,
    type BlogTag,
} from "@khenzii-dev/server/backend";
import { z } from "zod";


export const blogTagRouter = createTRPCRouter({
    getTags: publicProcedure.query(async ({ ctx }): Promise<BlogTag[]> => {
        const handler = new BlogTagService(ctx);
        return await handler.getTags();
    }),
    createTag: protectedProcedure
        .input(z.object({
            name: z.string(),
        }))
        .mutation(async ({ ctx, input }): Promise<BlogTag | undefined> => {
            const handler =  new BlogTagService(ctx, input);
            return await handler.createTag();
        }),
    updateTag: protectedProcedure
        .input(z.object({
            id: z.string(),
            updatedTag: z.object({
                name: z.string(),
            }),
        }))
        .mutation(async ({ ctx, input }): Promise<BlogTag | undefined> => {
            const handler =  new BlogTagService(ctx, input);
            return await handler.updateTag();
        }),
    deleteTag: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const handler =  new BlogTagService(ctx, input);
            return await handler.deleteTag();
        }),
});
