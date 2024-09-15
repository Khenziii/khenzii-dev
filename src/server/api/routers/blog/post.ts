import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    BlogPostService,
    createPostInput,
    updatePostInput,
    deletePostInput,
} from "@khenzii-dev/server/backend";


export const blogPostRouter = createTRPCRouter({
    getPosts: publicProcedure.query(async ({ ctx }) => {
        const handler = new BlogPostService(ctx);
        return await handler.getPosts();
    }),
    createPost: protectedProcedure
        .input(createPostInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new BlogPostService(ctx);
            return await handler.createPost(input);
        }),
    updatePost: protectedProcedure
        .input(updatePostInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new BlogPostService(ctx);
            return await handler.updatePost(input);
        }),
    deletePost: protectedProcedure
        .input(deletePostInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new BlogPostService(ctx);
            return await handler.deletePost(input);
        }),
});
