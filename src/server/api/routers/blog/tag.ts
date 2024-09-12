import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    BlogTagService,
    createTagInput,
    updateTagInput,
    deleteTagInput,
} from "@khenzii-dev/server/backend";


export const blogTagRouter = createTRPCRouter({
    getTags: publicProcedure.query(async ({ ctx }) => {
        const handler = new BlogTagService(ctx);
        return await handler.getTags();
    }),
    createTag: protectedProcedure
        .input(createTagInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new BlogTagService(ctx);
            return await handler.createTag(input);
        }),
    updateTag: protectedProcedure
        .input(updateTagInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new BlogTagService(ctx);
            return await handler.updateTag(input);
        }),
    deleteTag: protectedProcedure
        .input(deleteTagInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new BlogTagService(ctx);
            return await handler.deleteTag(input);
        }),
});
