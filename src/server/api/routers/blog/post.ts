import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    BlogPostService,
    getPostInput,
    getPostsInput,
    createPostInput,
    updatePostInput,
    deletePostInput,
} from "@khenzii-dev/server/backend";


export const blogPostRouter = createTRPCRouter({
    getPost: publicProcedure
        .input(getPostInput)
        .query(async ({ ctx, input }) => {
            const handler = new BlogPostService(ctx);
            return await handler.getPost(input);
        }),
    getPosts: publicProcedure
        .input(getPostsInput)
        .query(async ({ ctx, input }) => {
            const handler = new BlogPostService(ctx);
            return await handler.getPosts(input);
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
